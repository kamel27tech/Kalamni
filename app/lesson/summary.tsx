import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';
import { Typography, FONT } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

// ─── Tier logic ──────────────────────────────────────────────────────────────

type Tier = 'low' | 'intermediate' | 'advanced';

function getTier(percentage: number): Tier {
  if (percentage <= 39) return 'low';
  if (percentage <= 69) return 'intermediate';
  return 'advanced';
}

const TIER_CONTENT: Record<Tier, { title: string; subtitle: string }> = {
  low: {
    title: 'Keep Practicing!',
    subtitle: "Don't give up — every attempt makes you stronger.",
  },
  intermediate: {
    title: 'Good Effort!',
    subtitle: "You're making progress. Try again to master it.",
  },
  advanced: {
    title: 'Lesson Mastered!',
    subtitle: "You've finished all lessons in this unit. That's a big achievement!",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LessonSummaryScreen() {
  const router = useRouter();
  const { correct, total, elapsed } = useLocalSearchParams<{
    correct: string;
    total: string;
    lessonId: string;
    elapsed: string;
  }>();

  const correctNum = parseInt(correct ?? '0', 10);
  const totalNum = parseInt(total ?? '1', 10);
  const elapsedNum = parseInt(elapsed ?? '0', 10);
  const percentage = Math.round((correctNum / totalNum) * 100);
  const formattedTime = formatElapsed(elapsedNum);

  const tier = getTier(percentage);
  const { title, subtitle } = TIER_CONTENT[tier];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View pointerEvents="none" style={styles.bgGlow} />
      <View style={styles.container} accessibilityRole="summary">
        <View style={styles.topSection}>
          <Image
            source={require('@/assets/images/summary-illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
            accessible={false}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <ScoreTimingRow percentage={percentage} formattedTime={formattedTime} />
        </View>
        <Button
          label="Next Unit"
          variant="primary"
          size="M"
          rightIcon={<Icon name="arrow_forward" size={24} color={Colors.text.negative} />}
          onPress={() => router.replace('/')}
          style={styles.cta}
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Shared display component used in Showcase ────────────────────────────────

type ScoreTimingRowProps = {
  percentage: number;
  formattedTime: string;
};

export function ScoreTimingRow({ percentage, formattedTime }: ScoreTimingRowProps) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>Score</Text>
        </View>
        <View style={styles.cardBody}>
          <Icon name="bar_chart" size={24} color={Colors.success.surface} />
          <Text style={styles.statValue}>{percentage}%</Text>
        </View>
      </View>
      <View style={styles.statCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>Timing</Text>
        </View>
        <View style={styles.cardBody}>
          <Icon name="schedule" size={24} color={Colors.info.surface} />
          <Text style={styles.statValue}>{formattedTime}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface.subtle,
  },
  
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    width: '100%',
  },
  illustration: {
    width: Math.round(121 ),
    height: Math.round(160 ),
  },
  textContainer: {
    gap: Spacing.xs,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...Typography.english.heading.h2,
    color: Colors.text.heading,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.english.body.m,
    color: Colors.text.body,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface.subtle,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 12,
    gap: 12,
  },
  cardHeader: {
    backgroundColor: Colors.surface.default,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.text.title,
    textAlign: 'center',
  },
  cardBody: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  statValue: {
    ...Typography.english.title.l,
    color: Colors.text.title,
    textAlign: 'center',
    flex: 1,
  },
  cta: {
    width: '100%',
  },
});
