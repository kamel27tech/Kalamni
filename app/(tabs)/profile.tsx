import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAuthStore } from '@/lib/stores/authStore';

const AVATAR_SIZE = Math.round(88);
const AVATAR_HALF = Math.round(AVATAR_SIZE / 2);
const AVATAR_BORDER = Math.round(4);
const AVATAR_OFFSET_ABOVE_CARD = Math.round(30);
const CARD_RADIUS = Math.round(16);
const ICON_BTN_PADDING = Math.round(12);

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  async function handleLogout() {
    await signOut();
    router.replace('/sign-in');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Icon name="arrow_back" size={24} color={Colors.icon.default} />
        </Pressable>
        <View style={styles.topBarRight}>
          <Pressable
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Help"
          >
            <Icon name="contact_support" size={24} color={Colors.icon.default} />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Icon name="settings" size={24} color={Colors.icon.default} />
          </Pressable>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Icon name="person" size={Math.round(48)} color={Colors.icon.subtle} />
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {user?.email ?? ''}
          </Text>
          <Text style={styles.subtitle}>Free Account</Text>
          <View style={styles.buttonWrap}>
            <Button
              label="Log Out"
              variant="tertiary"
              size="S"
              leftIcon={<Icon name="logout" size={24} color={Colors.icon.default} />}
              onPress={handleLogout}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface.default,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Math.round(12),
    paddingLeft: Math.round(1),
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: ICON_BTN_PADDING,
  },
  cardWrapper: {
    marginTop: Math.round(32),
  },
  card: {
    backgroundColor: Colors.surface.subtle,
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
    paddingTop: Math.round(78),
    paddingBottom: Math.round(20),
    paddingHorizontal: Math.round(16),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: Math.round(4),
    elevation: 2,
  },
  avatar: {
    position: 'absolute',
    top: -AVATAR_OFFSET_ABOVE_CARD,
    alignSelf: 'center',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_HALF,
    borderWidth: AVATAR_BORDER,
    borderColor: Colors.border.default,
    backgroundColor: Colors.surface.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.english.heading.h3,
    color: Colors.text.heading,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.english.body.l,
    color: Colors.text.body,
    textAlign: 'center',
  },
  buttonWrap: {
    marginTop: Math.round(12),
  },
});
