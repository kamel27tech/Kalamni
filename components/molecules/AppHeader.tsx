import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { Icon } from '@/components/atoms/Icon';
import { FONT } from '@/constants/typography';

// ─── Types ─────────────────────────────────────────────────────────────────────

type FreeProps = {
  variant: 'free';
  isHomePage: boolean;
  userName: string;
  pageTitle?: string;
  avatarUri?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  style?: ViewStyle;
};

type PlusProps = {
  variant: 'plus';
  isHomePage: boolean;
  userName: string;
  daysLeft: number;
  pageTitle?: string;
  avatarUri?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  style?: ViewStyle;
};

type B2BProps = {
  variant: 'b2b';
  isHomePage: boolean;
  userName: string;
  orgName: string;
  orgLogoUri?: string;
  pageTitle?: string;
  avatarUri?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  style?: ViewStyle;
};

type GuestProps = {
  variant: 'guest';
  isHomePage: boolean;
  pageTitle?: string;
  style?: ViewStyle;
};

export type AppHeaderProps = FreeProps | PlusProps | B2BProps | GuestProps;

// ─── Sub-components ────────────────────────────────────────────────────────────

function NotifButton({ count, onPress }: { count?: number; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.notifWrap}
      accessibilityRole="button"
      accessibilityLabel={count ? `Notifications, ${count} unread` : 'Notifications'}
    >
      <Icon name="chat" size={24} color={Colors.icon.default} />
      {count != null && count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </Pressable>
  );
}

function Avatar({
  uri,
  ringColor,
  crownBadge = false,
  onPress,
}: {
  uri?: string;
  ringColor: string;
  crownBadge?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.avatarOuter}
      accessibilityRole="button"
      accessibilityLabel="Go to profile"
    >
      <View style={[styles.avatarRing, { borderColor: ringColor }]}>
        {uri ? (
          <Image source={{ uri }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={24} color={Colors.icon.subtle} />
          </View>
        )}
      </View>
      {crownBadge && (
        <View style={styles.crownBadge}>
          <Text style={styles.crownText}>👑</Text>
        </View>
      )}
    </Pressable>
  );
}

function GuestAvatar({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.guestAvatarWrap}
      accessibilityRole="button"
      accessibilityLabel="Go to profile"
    >
      <Icon name="person" size={24} color={Colors.icon.subtle} />
    </Pressable>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AppHeader(props: AppHeaderProps) {
  const router = useRouter();
  const { style } = props;

  function goToProfile() {
    router.push('/(tabs)/profile');
  }

  if (props.variant === 'free') {
    const { isHomePage, userName, pageTitle, avatarUri, notificationCount, onNotificationPress } = props;
    return (
      <View style={[styles.container, style]}>
        <View style={styles.row}>
          {isHomePage ? (
            <View style={styles.textBlock}>
              <Text style={styles.greeting} numberOfLines={1}>Hi, {userName}</Text>
              <Text style={styles.subtitle}>Free Account</Text>
            </View>
          ) : (
            <View style={styles.titleBlock}>
              <Text style={styles.pageTitle} numberOfLines={1}>{pageTitle ?? '(Page Title)'}</Text>
            </View>
          )}
          <NotifButton count={notificationCount} onPress={onNotificationPress} />
          <Avatar uri={avatarUri} ringColor={Colors.border.default} onPress={goToProfile} />
        </View>
      </View>
    );
  }

  if (props.variant === 'plus') {
    const { isHomePage, userName, daysLeft, pageTitle, avatarUri, notificationCount, onNotificationPress } = props;
    return (
      <View style={[styles.container, style]}>
        <View style={styles.row}>
          {isHomePage ? (
            <View style={styles.textBlock}>
              <Text style={styles.greeting} numberOfLines={1}>Hi, {userName}</Text>
              <Text style={styles.subtitle}>{daysLeft} Days Left</Text>
            </View>
          ) : (
            <View style={styles.titleBlock}>
              <Text style={styles.pageTitle} numberOfLines={1}>{pageTitle ?? '(Page Title)'}</Text>
            </View>
          )}
          <NotifButton count={notificationCount} onPress={onNotificationPress} />
          <Avatar uri={avatarUri} ringColor={Colors.secondary.surface} crownBadge onPress={goToProfile} />
        </View>
      </View>
    );
  }

  if (props.variant === 'b2b') {
    const { isHomePage, userName, orgName, orgLogoUri, pageTitle, avatarUri, notificationCount, onNotificationPress } = props;
    return (
      <View style={[styles.container, style]}>
        <View style={styles.row}>
          <View style={styles.b2bLeft}>
            {orgLogoUri ? (
              <Image source={{ uri: orgLogoUri }} style={styles.orgLogo} resizeMode="contain" />
            ) : (
              <View style={styles.orgLogoPlaceholder} />
            )}
            <View style={styles.textBlock}>
              {isHomePage ? (
                <>
                  <Text style={styles.greeting} numberOfLines={1}>Hi, {userName}</Text>
                  <Text style={styles.subtitle} numberOfLines={1}>{orgName}</Text>
                </>
              ) : (
                <Text style={styles.pageTitle} numberOfLines={1}>{pageTitle ?? '(Page Title)'}</Text>
              )}
            </View>
          </View>
          <NotifButton count={notificationCount} onPress={onNotificationPress} />
          <Avatar uri={avatarUri} ringColor={Colors.primary.surface} onPress={goToProfile} />
        </View>
      </View>
    );
  }

  // guest
  const { isHomePage, pageTitle } = props;
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        {isHomePage ? (
          <View style={styles.textBlock}>
            <Text style={styles.greeting}>Welcome, Guest</Text>
            <Text style={styles.subtitle}>Sign up to save your progress.</Text>
          </View>
        ) : (
          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle} numberOfLines={1}>{pageTitle ?? '(Page Title)'}</Text>
          </View>
        )}
        <GuestAvatar onPress={goToProfile} />
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.subtle,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  titleBlock: {
    flex: 1,
  },
  greeting: {
    ...Typography.english.title.m,
    color: Colors.text.heading,
  },
  subtitle: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
  },
  pageTitle: {
    ...Typography.english.heading.h3,
    color: Colors.text.heading,
  },
  // Notification button
  notifWrap: {
    width: 44,
    height: 44,
    backgroundColor: Colors.surface.default,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 7,
    left: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badgeText: {
    fontFamily: FONT.bold,
    fontSize: 8,
    lineHeight: 10,
    color: Colors.text.negative,
    textAlign: 'center',
  },
  // Standard avatar (free / plus / b2b)
  avatarOuter: {
    width: 56,
    height: 56,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: Colors.surface.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.secondary.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownText: {
    fontSize: 10,
    lineHeight: 12,
  },
  // Guest avatar
  guestAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface.default,
    borderWidth: 3,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // B2B left group
  b2bLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orgLogo: {
    width: 56,
    height: 56,
  },
  orgLogoPlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: Colors.surface.default,
    borderRadius: 8,
  },
});
