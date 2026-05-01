import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Primitives } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/atoms/Icon';
import ProgressBar from '@/components/atoms/ProgressBar';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LevelBannerProps = {
  levelTitle: string;
  progress: number; // 0–1
  onPress?: () => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BADGE_SIZE = 42;
const BADGE_INNER_SIZE = 32;
const BADGE_ICON_SIZE = 20;
const PROGRESS_HEIGHT = 10;
const DOT_SIZE = 10;
const CHEVRON_SIZE = 20;
const TROPHY_SIZE = 20;

// ─── Sub-components ───────────────────────────────────────────────────────────

function LevelBadge() {
  return (
    <View style={styles.badge}>
      <View style={styles.badgeInner}>
        <Icon name="castle" size={BADGE_ICON_SIZE} color={Colors.secondary.surface} />
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LevelBanner({ levelTitle, progress, onPress }: LevelBannerProps) {
  const [barWidth, setBarWidth] = useState(0);
  const clamped = Math.min(1, Math.max(0, progress));

  // Position the dot at the right edge of the fill, clamped within the bar
  const dotLeft = Math.round(
    Math.max(0, Math.min(barWidth - DOT_SIZE, clamped * barWidth - DOT_SIZE / 2)),
  );

  const content = (
    <>
      {/* Top row: badge + title + chevron */}
      <View style={styles.topRow}>
        <LevelBadge />
        <Text style={styles.title} numberOfLines={1}>
          {levelTitle}
        </Text>
        <Icon name="chevron_right" size={CHEVRON_SIZE} color={Colors.icon.subtle} />
      </View>

      {/* Progress row: bar with dot marker + trophy */}
      <View style={styles.progressRow}>
        <View
          style={styles.barContainer}
          onLayout={(e) => setBarWidth(Math.round(e.nativeEvent.layout.width))}
        >
          <ProgressBar
            progress={clamped}
            height={PROGRESS_HEIGHT}
            trackColor={Primitives.secondary[100]} // TODO: add secondary.surface.track token (Figma: #fef0ce)
            fillColor={Colors.secondary.surface}
          />
          {barWidth > 0 && (
            <View style={[styles.dot, { left: dotLeft }]} />
          )}
        </View>
        <Icon name="emoji_events" size={TROPHY_SIZE} color={Colors.icon.disabled} />
      </View>
    </>
  );

  if (onPress != null) {
    return (
      <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: Math.round(BADGE_SIZE / 2),
    backgroundColor: Primitives.secondary[100], // TODO: add secondary.surface.badgeOuter token
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInner: {
    width: BADGE_INNER_SIZE,
    height: BADGE_INNER_SIZE,
    borderRadius: Math.round(BADGE_INNER_SIZE / 2),
    backgroundColor: Primitives.secondary[200], // TODO: add secondary.surface.badgeInner token
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.english.title.m,
    color: Colors.text.heading,
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  barContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: Math.round(DOT_SIZE / 2),
    backgroundColor: Colors.secondary.surface,
    // vertically centered over the bar: (PROGRESS_HEIGHT - DOT_SIZE) / 2 = 0
    top: 0,
  },
});
