import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_LESSONS_KEY = 'kalimni:completed_lessons';

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
  try {
    const current = await getCompletedLessons();
    if (current.includes(lessonId)) return current;
    const updated = [...current, lessonId];
    await saveCompletedLessons(updated);
    return updated;
  } catch (e) {
    console.error('markLessonComplete error:', e);
    return [];
  }
}

export function isLessonCompleted(lessonId: string, completedLessons: string[]): boolean {
  return completedLessons.includes(lessonId);
}

export async function syncLessonToSupabase(lessonId: string, userId: string): Promise<void> {
  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase
      .from('lesson_progress')
      .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });
  } catch (e) {
    console.error('syncLessonToSupabase error:', e);
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
