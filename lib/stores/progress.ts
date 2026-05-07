import { create } from 'zustand';
import {
  getCompletedLessons,
  markLessonComplete,
  fetchCompletedLessonsFromSupabase,
  syncLessonToSupabase,
} from '@/lib/progress';

type ProgressState = {
  completedLessons: string[];
  isHydrated: boolean;
  userId: string | null;
  hydrate: () => Promise<void>;
  markComplete: (lessonId: string) => Promise<void>;
  isCompleted: (lessonId: string) => boolean;
  setUserId: (id: string | null) => void;
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedLessons: [],
  isHydrated: false,
  userId: null,

  setUserId: (id: string | null) => {
    set({ userId: id });
  },

  hydrate: async () => {
    const local = await getCompletedLessons();
    const userId = get().userId;
    let merged: string[];
    if (userId !== null) {
      const remote = await fetchCompletedLessonsFromSupabase(userId);
      merged = Array.from(new Set([...local, ...remote]));
    } else {
      merged = local;
    }
    set({ completedLessons: merged, isHydrated: true });
  },

  markComplete: async (lessonId: string) => {
    const completedLessons = await markLessonComplete(lessonId);
    const userId = get().userId;
    if (userId !== null) {
      await syncLessonToSupabase(lessonId, userId);
    }
    set({ completedLessons });
  },

  isCompleted: (lessonId: string) => {
    return get().completedLessons.includes(lessonId);
  },
}));
