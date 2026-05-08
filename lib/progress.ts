import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_LESSONS_KEY = 'kalimni:completed_lessons';
const PENDING_SYNC_KEY = 'kalimni:pending_sync_lessons';

// ─── Local completed-lesson list ──────────────────────────────────────────────

export async function getCompletedLessons(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(COMPLETED_LESSONS_KEY);
    if (raw === null) return [];
    return JSON.parse(raw) as string[];
  } catch (e) {
    console.error('getCompletedLessons error:', e);
    return [];
  }
}

export async function saveCompletedLessons(lessonIds: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(lessonIds));
  } catch (e) {
    console.error('saveCompletedLessons error:', e);
  }
}

export async function markLessonComplete(lessonId: string): Promise<string[]> {
  const current = await getCompletedLessons();
  if (current.includes(lessonId)) return current;
  const updated = [...current, lessonId];
  await saveCompletedLessons(updated);
  return updated;
}

export function isLessonCompleted(lessonId: string, completedLessons: string[]): boolean {
  return completedLessons.includes(lessonId);
}

// ─── Pending-sync queue (lessons saved locally but not yet on Supabase) ──────

export async function getPendingSync(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    if (raw === null) return [];
    return JSON.parse(raw) as string[];
  } catch (e) {
    console.error('getPendingSync error:', e);
    return [];
  }
}

export async function addPendingSync(lessonId: string): Promise<void> {
  try {
    const current = await getPendingSync();
    if (current.includes(lessonId)) return;
    await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify([...current, lessonId]));
  } catch (e) {
    console.error('addPendingSync error:', e);
  }
}

export async function removePendingSync(lessonId: string): Promise<void> {
  try {
    const current = await getPendingSync();
    const updated = current.filter((id) => id !== lessonId);
    await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(updated));
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
    await removePendingSync(lessonId);
    return true;
  } catch (e) {
    console.error('syncLessonToSupabase error:', e);
    await addPendingSync(lessonId);
    return false;
  }
}

export async function flushPendingSync(userId: string): Promise<void> {
  const pending = await getPendingSync();
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
