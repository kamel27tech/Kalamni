import { create } from 'zustand';
import {
  getCompletedLessons,
  markLessonComplete,
} from '@/lib/progress';

type ProgressState = {
  completedLessons: string[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  markComplete: (lessonId: string) => Promise<void>;
  isCompleted: (lessonId: string) => boolean;
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedLessons: [],
  isHydrated: false,

  hydrate: async () => {
    const completedLessons = await getCompletedLessons();
    set({ completedLessons, isHydrated: true });
  },

  markComplete: async (lessonId: string) => {
    const completedLessons = await markLessonComplete(lessonId);
    set({ completedLessons });
  },

  isCompleted: (lessonId: string) => {
    return get().completedLessons.includes(lessonId);
  },
}));
