import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { Icon } from '@/components/atoms/Icon';
import LevelBanner from '@/components/molecules/LevelBanner';
import SectionHeader from '@/components/molecules/SectionHeader';
import UnitNode, { UnitNodeVariant } from '@/components/molecules/UnitNode';
import UnitBottomSheet from '@/components/organisms/UnitBottomSheet';
import { getTopics, getAllLevels } from '@/lib/content';
import type { Unit } from '@/types/content';

// ─── Types ────────────────────────────────────────────────────────────────────

type UnitRow = {
  unit: Unit;
  variant: UnitNodeVariant;
};

type TopicSection = {
  id: string;
  title: string;
  totalUnits: number;
  rows: UnitRow[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

function buildSections(): TopicSection[] {
  const topics = getTopics();
  let isFirstUnit = true;

  return topics.map((topic) => {
    const units = [...topic.units].sort((a, b) => a.order - b.order);

    const rows: UnitRow[] = units.map((unit) => {
      const variant: UnitNodeVariant = isFirstUnit ? 'open' : 'locked';
      if (isFirstUnit) isFirstUnit = false;
      return { unit, variant };
    });

    return {
      id: topic.id,
      title: topic.title.en,
      totalUnits: units.length,
      rows,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const sections = useMemo(buildSections, []);

  const level = useMemo(() => getAllLevels()[0], []);
  const levelTitle = level ? `${level.title.en} Level` : 'Beginner Level';

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  function handleUnitPress(unit: Unit) {
    setSelectedUnit(unit);
  }

  function handleLessonPress(lessonId: string) {
    setSelectedUnit(null);
    router.push(`/lesson/${lessonId}`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* App header */}
      <View style={styles.header}>
        <Text style={styles.appName}>Kalimni</Text>
        <Icon name="settings" size={24} color={Colors.icon.subtle} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Level banner */}
        <View style={styles.bannerWrapper}>
          <LevelBanner levelTitle={levelTitle} progress={0.05} />
        </View>

        {/* Topic sections */}
        {sections.map((section) => (
          <View key={section.id}>
            <SectionHeader
              title={section.title}
              completedUnits={0}
              totalUnits={section.totalUnits}
            />
            <View style={styles.unitsContainer}>
              {section.rows.map(({ unit, variant }, index) => (
                <React.Fragment key={unit.id}>
                  {index > 0 && <View style={styles.unitDivider} />}
                  <UnitNode
                    variant={variant}
                    type="unit"
                    title={unit.title.en}
                    onPress={
                      variant === 'open'
                        ? () => handleUnitPress(unit)
                        : undefined
                    }
                  />
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Lesson picker bottom sheet */}
      <UnitBottomSheet
        isVisible={selectedUnit != null}
        onClose={() => setSelectedUnit(null)}
        lessons={selectedUnit?.lessons ?? []}
        onLessonPress={handleLessonPress}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface.default,
  },
  appName: {
    ...Typography.english.heading.h3,
    color: Colors.text.heading,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  bannerWrapper: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  unitsContainer: {
    // UnitNode owns its own horizontal padding; no extra container padding needed
  },
  // Vertical connector line centered under the 80px circle
  // UnitNode paddingLeft(16) + circle radius(40) - half line width(0.5) ≈ 55.5 → 55
  unitDivider: {
    height: 20,
    marginLeft: 55,
    width: 1,
    backgroundColor: Colors.border.default,
  },
  bottomPad: {
    height: Spacing.xxl,
  },
});
