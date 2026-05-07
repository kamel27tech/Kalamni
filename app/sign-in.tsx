import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import InputField from '@/components/atoms/InputField';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { useAuthStore } from '@/lib/stores/authStore';

const mascot = require('@/assets/images/icon.png');

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, isLoading, error } = useAuthStore();

  useEffect(() => {
    useAuthStore.setState({ error: null });
  }, []);

  async function handleLogin() {
    await signIn(email, password);
    if (!useAuthStore.getState().error) {
      router.replace('/');
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Top ──────────────────────────────────────────────── */}
          <View style={s.top}>
            <View style={s.header}>
              <Image source={mascot} style={s.avatar} />
              <View style={s.headerText}>
                <Text style={s.title}>Welcome Back</Text>
                <Text style={s.subtitle}>
                  Fill the following information to Continue your learning path!
                </Text>
              </View>
            </View>

            <View style={s.form}>
              <View style={s.fields}>
                <InputField
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  accessibilityLabel="Email address"
                />
                <InputField
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  accessibilityLabel="Password"
                  rightIcon={
                    <Pressable
                      onPress={() => setShowPassword((v) => !v)}
                      hitSlop={8}
                      style={s.eyeBtn}
                    >
                      <Icon
                        name={showPassword ? 'visibility_off' : 'visibility'}
                        size={Math.round(24)}
                        color={Colors.icon.subtle}
                      />
                    </Pressable>
                  }
                />
              </View>

              <View style={s.cta}>
                <Button
                  label="Login"
                  variant="primary"
                  size="M"
                  disabled={isLoading}
                  onPress={handleLogin}
                  rightIcon={
                    <Icon name="arrow_forward" size={Math.round(24)} color={Colors.icon.negative} />
                  }
                />
                {error != null && (
                  <Text style={s.error} accessibilityRole="alert">
                    {error}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* ── Footer ───────────────────────────────────────────── */}
          <View style={s.footer}>
            <Text style={s.footerText}>New member?</Text>
            <Button
              label="Register Now!"
              variant="tertiary"
              size="M"
              onPress={() => router.replace('/sign-up')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface.subtle,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Math.round(24),
    paddingTop: Math.round(32),
    paddingBottom: Math.round(24),
  },
  top: {
    gap: Math.round(64),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Math.round(12),
  },
  avatar: {
    width: Math.round(64),
    height: Math.round(64),
    borderRadius: Math.round(32),
  },
  headerText: {
    flex: 1,
    gap: Math.round(4),
  },
  title: {
    ...Typography.english.heading.h3,
    color: Colors.text.title,
  },
  subtitle: {
    ...Typography.english.body.m,
    color: Colors.text.body,
  },
  form: {
    gap: Math.round(32),
  },
  fields: {
    gap: Math.round(12),
  },
  cta: {
    gap: Math.round(12),
  },
  eyeBtn: {
    width: Math.round(24),
    height: Math.round(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    ...Typography.english.body.m,
    color: Colors.error.text,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Math.round(40),
  },
  footerText: {
    ...Typography.english.body.l,
    color: Colors.text.body,
  },
});
