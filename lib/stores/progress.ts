import { create } from 'zustand';
import {
  getCompletedLessons,
  markLessonComplete,
  fetchCompletedLessonsFromSupabase,
  syncLessonToSupabase,
  addPendingSync,
  flushPendingSync,
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

// Merges new ids into the list and dedupes — preserves insertion order.
function mergeIds(existing: string[], incoming: string[]): string[] {
  const set = new Set(existing);
  const merged = [...existing];
  for (const id of incoming) {
    if (!set.has(id)) {
      set.add(id);
      merged.push(id);
    }
  }
  return merged;
}

let hydratePromise: Promise<void> | null = null;

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedLessons: [],
  isHydrated: false,
  userId: null,

  setUserId: (id: string | null) => {
    set({ userId: id });
  },

  // Reads local AsyncStorage and (if signed in) Supabase, then merges into the
  // current store state — never overwrites in-flight local changes. Concurrent
  // calls share a single in-flight promise.
  hydrate: async () => {
    if (hydratePromise) return hydratePromise;
    hydratePromise = (async () => {
      try {
        const local = await getCompletedLessons();
        const userId = get().userId;
        let remote: string[] = [];
        if (userId !== null) {
          remote = await fetchCompletedLessonsFromSupabase(userId);
          // Push any locally-saved lessons that aren't on the server yet.
          const remoteSet = new Set(remote);
          const toPush = local.filter((id) => !remoteSet.has(id));
          for (const id of toPush) {
            await syncLessonToSupabase(id, userId);
          }
          // Retry any prior failed syncs.
          await flushPendingSync(userId);
        }
        set((state) => ({
          completedLessons: mergeIds(state.completedLessons, mergeIds(local, remote)),
          isHydrated: true,
        }));
      } finally {
        hydratePromise = null;
      }
    })();
    return hydratePromise;
  },

  // Saves the lesson locally and to Supabase. Uses a functional update so
  // concurrent hydrations can't wipe the new lesson.
  markComplete: async (lessonId: string) => {
    await markLessonComplete(lessonId);
    set((state) => ({
      completedLessons: mergeIds(state.completedLessons, [lessonId]),
    }));
    const userId = get().userId;
    if (userId !== null) {
      // Fire-and-forget; failures land in the pending-sync queue and retry on next hydrate.
      syncLessonToSupabase(lessonId, userId);
    } else {
      // Not signed in yet — queue for later sync.
      addPendingSync(lessonId);
    }
  },

  isCompleted: (lessonId: string) => {
    return get().completedLessons.includes(lessonId);
  },
}));
