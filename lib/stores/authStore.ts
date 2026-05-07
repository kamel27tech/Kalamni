import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { AuthUser } from '@/types/auth';

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }
    const u = data.user;
    set({
      isLoading: false,
      user: u ? { id: u.id, email: u.email ?? '' } : null,
    });
  },

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }
    const u = data.user;
    set({
      isLoading: false,
      user: u ? { id: u.id, email: u.email ?? '' } : null,
    });
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    const { error } = await supabase.auth.signOut();
    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }
    set({ isLoading: false, user: null });
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        set({ isLoading: false, user: null });
        return;
      }
      const u = data.session.user;
      set({ isLoading: false, user: { id: u.id, email: u.email ?? '' } });
    } catch {
      set({ isLoading: false, user: null });
    }
  },
}));
