import { create } from 'zustand';
import {
  getCompletedLessons,
  markLessonComplete,
  fetchCompletedLessonsFromSupabase,
  syncLessonToSupabase,
  addPendingSync,
  flushPendingSync,
  saveCompletedLessons,
  getPendingSync,
  migrateAnonymousProgress,
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

// Hydrate is keyed per-user: a hydrate for user A can't short-circuit a
// hydrate for user B, but two concurrent hydrates for the same user dedupe.
const hydrateInFlight = new Map<string, Promise<void>>();
const ANON_HYDRATE_KEY = '__anon__';

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedLessons: [],
  isHydrated: false,
  userId: null,

  // Resets state when the user actually changes so the previous user's
  // progress can't bleed into the next session's UI or sync push.
  setUserId: (id: string | null) => {
    if (get().userId === id) return;
    set({ userId: id, completedLessons: [], isHydrated: false });
  },

  hydrate: async () => {
    const userId = get().userId;
    const key = userId ?? ANON_HYDRATE_KEY;
    const existing = hydrateInFlight.get(key);
    if (existing) return existing;

    const startSnapshot = new Set(get().completedLessons);

    const promise = (async () => {
      try {
        let truth: string[];
        if (userId !== null) {
          // Carry over any progress completed while signed-out.
          await migrateAnonymousProgress(userId);
          // Retry any prior failed syncs before reading remote, so the
          // remote we fetch is as up-to-date as we can make it.
          await flushPendingSync(userId);
          const remote = await fetchCompletedLessonsFromSupabase(userId);
          const local = await getCompletedLessons(userId);
          const remoteSet = new Set(remote);
          const toPush = local.filter((id) => !remoteSet.has(id));
          for (const id of toPush) {
            await syncLessonToSupabase(id, userId);
          }
          // Server is the source of truth; pending = writes still queued
          // for retry that we want to keep visible until they land.
          const pending = await getPendingSync(userId);
          truth = mergeIds(mergeIds(remote, toPush), pending);
          // Replace local cache with truth so a remote-side delete on
          // another device is reflected on the next hydrate (instead of
          // being re-pushed from a stale local cache).
          await saveCompletedLessons(userId, truth);
        } else {
          truth = await getCompletedLessons(null);
        }

        // If the user changed mid-hydrate, drop our result — the new
        // user's hydrate will write the correct state.
        if (get().userId !== userId) return;

        set((state) => {
          // Preserve any markCompletes that landed since this hydrate began.
          const inFlight = state.completedLessons.filter((id) => !startSnapshot.has(id));
          return {
            completedLessons: mergeIds(truth, inFlight),
            isHydrated: true,
          };
        });
      } finally {
        hydrateInFlight.delete(key);
      }
    })();

    hydrateInFlight.set(key, promise);
    return promise;
  },

  // Saves the lesson locally and to Supabase. Uses a functional update so
  // concurrent hydrations can't wipe the new lesson.
  markComplete: async (lessonId: string) => {
    const userId = get().userId;
    await markLessonComplete(userId, lessonId);
    set((state) => ({
      completedLessons: mergeIds(state.completedLessons, [lessonId]),
    }));
    if (userId !== null) {
      // Fire-and-forget: failures are caught inside syncLessonToSupabase,
      // which adds the lesson to the per-user pending-sync queue so the
      // next hydrate retries it.
      syncLessonToSupabase(lessonId, userId);
    } else {
      // Not signed in yet — queue under the anonymous scope so it migrates
      // to the user's scope on first sign-in.
      addPendingSync(null, lessonId);
    }
  },

  isCompleted: (lessonId: string) => {
    return get().completedLessons.includes(lessonId);
  },
}));
