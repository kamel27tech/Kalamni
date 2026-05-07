import 'react-native-url-polyfill/auto';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/lib/stores/authStore';
import { useProgressStore } from '@/lib/stores/progress';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const user = useAuthStore((s) => s.user);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const [fontsLoaded] = useFonts({
    'IBMPlexSansArabic-Regular': require('../assets/fonts/IBMPlexSansArabic-Regular.ttf'),
    'IBMPlexSansArabic-Medium': require('../assets/fonts/IBMPlexSansArabic-Medium.ttf'),
    'IBMPlexSansArabic-SemiBold': require('../assets/fonts/IBMPlexSansArabic-SemiBold.ttf'),
    'IBMPlexSansArabic-Bold': require('../assets/fonts/IBMPlexSansArabic-Bold.ttf'),
    'MaterialSymbols-Rounded': require('../assets/fonts/material-symbols-rounded-latin-400-normal.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded && authChecked) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authChecked]);

  useEffect(() => {
    useProgressStore.getState().hydrate();
  }, []);

  useEffect(() => {
    const done = () => setAuthChecked(true);
    const timer = setTimeout(done, 3000);
    useAuthStore.getState().initialize().finally(done);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!fontsLoaded || !authChecked) return;
    const inAuthScreen = segments[0] === 'sign-in' || segments[0] === 'sign-up';
    if (!user && !inAuthScreen) {
      router.replace('/sign-in');
    } else if (user && inAuthScreen) {
      router.replace('/');
    }
  }, [fontsLoaded, authChecked, user, segments, router]);

  if (!fontsLoaded || !authChecked) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="showcase" options={{ title: 'Component Showcase' }} />
        <Stack.Screen name="content-test" options={{ title: 'Content Diagnostic' }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
