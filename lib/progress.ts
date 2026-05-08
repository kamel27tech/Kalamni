import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_LESSONS_PREFIX = 'kalimni:completed_lessons';
const PENDING_SYNC_PREFIX = 'kalimni:pending_sync_lessons';
const ANONYMOUS_SCOPE = 'anonymous';

// Per-user keys prevent one account's local progress from leaking into
// another's hydrate/push pipeline on a shared device.
function scope(userId: string | null): string {
  return userId ?? ANONYMOUS_SCOPE;
}

function completedKey(userId: string | null): string {
  return `${COMPLETED_LESSONS_PREFIX}:${scope(userId)}`;
}

function pendingKey(userId: string | null): string {
  return `${PENDING_SYNC_PREFIX}:${scope(userId)}`;
}

// ─── Local completed-lesson list ──────────────────────────────────────────────

export async function getCompletedLessons(userId: string | null): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(completedKey(userId));
    if (raw === null) return [];
    return JSON.parse(raw) as string[];
  } catch (e) {
    console.error('getCompletedLessons error:', e);
    return [];
  }
}

export async function saveCompletedLessons(
  userId: string | null,
  lessonIds: string[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(completedKey(userId), JSON.stringify(lessonIds));
  } catch (e) {
    console.error('saveCompletedLessons error:', e);
  }
}

export async function markLessonComplete(
  userId: string | null,
  lessonId: string,
): Promise<string[]> {
  const current = await getCompletedLessons(userId);
  if (current.includes(lessonId)) return current;
  const updated = [...current, lessonId];
  await saveCompletedLessons(userId, updated);
  return updated;
}

export function isLessonCompleted(lessonId: string, completedLessons: string[]): boolean {
  return completedLessons.includes(lessonId);
}

// Moves any progress completed while signed-out into the signed-in user's
// scope so it isn't lost on first sign-in. Cleared from anonymous after copy.
export async function migrateAnonymousProgress(userId: string): Promise<void> {
  try {
    const anonCompleted = await getCompletedLessons(null);
    const anonPending = await getPendingSync(null);
    if (anonCompleted.length === 0 && anonPending.length === 0) return;

    if (anonCompleted.length > 0) {
      const userCompleted = await getCompletedLessons(userId);
      const merged = Array.from(new Set([...userCompleted, ...anonCompleted]));
      await saveCompletedLessons(userId, merged);
      await AsyncStorage.removeItem(completedKey(null));
    }
    if (anonPending.length > 0) {
      const userPending = await getPendingSync(userId);
      const merged = Array.from(new Set([...userPending, ...anonPending]));
      await AsyncStorage.setItem(pendingKey(userId), JSON.stringify(merged));
      await AsyncStorage.removeItem(pendingKey(null));
    }
  } catch (e) {
    console.error('migrateAnonymousProgress error:', e);
  }
}

// ─── Pending-sync queue (lessons saved locally but not yet on Supabase) ──────

export async function getPendingSync(userId: string | null): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(pendingKey(userId));
    if (raw === null) return [];
    return JSON.parse(raw) as string[];
  } catch (e) {
    console.error('getPendingSync error:', e);
    return [];
  }
}

export async function addPendingSync(
  userId: string | null,
  lessonId: string,
): Promise<void> {
  try {
    const current = await getPendingSync(userId);
    if (current.includes(lessonId)) return;
    await AsyncStorage.setItem(pendingKey(userId), JSON.stringify([...current, lessonId]));
  } catch (e) {
    console.error('addPendingSync error:', e);
  }
}

export async function removePendingSync(
  userId: string | null,
  lessonId: string,
): Promise<void> {
  try {
    const current = await getPendingSync(userId);
    const updated = current.filter((id) => id !== lessonId);
    await AsyncStorage.setItem(pendingKey(userId), JSON.stringify(updated));
  } catch (e) {
    console.error('removePendingSync error:', e);
  }
}

// ─── Supabase sync ────────────────────────────────────────────────────────────

export async function syncLessonToSupabase(lessonId: string, userId: string): Promise<boolean> {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase
      .from('lesson_progress')
      .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });
    if (error) throw error;
    await removePendingSync(userId, lessonId);
    return true;
  } catch (e) {
    console.error('syncLessonToSupabase error:', e);
    await addPendingSync(userId, lessonId);
    return false;
  }
}

export async function flushPendingSync(userId: string): Promise<void> {
  const pending = await getPendingSync(userId);
  if (pending.length === 0) return;
  for (const lessonId of pending) {
    await syncLessonToSupabase(lessonId, userId);
  }
}

export async function fetchCompletedLessonsFromSupabase(userId: string): Promise<string[]> {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).map((row: { lesson_id: string }) => row.lesson_id);
  } catch (e) {
    console.error('fetchCompletedLessonsFromSupabase error:', e);
    return [];
  }
}
