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
