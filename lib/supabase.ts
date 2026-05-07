import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nuqmvurdvqmbmuikohxt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cW12dXJkdnFtYm11aWtvaHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDU1NTcsImV4cCI6MjA5MzU4MTU1N30.6CjCiwPxB-El7bhrbmx3xnoqVIvZ45p4iRRpnF6vTz4';

const authConfig =
  Platform.OS === 'web'
    ? { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    : { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false };

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: authConfig,
});
