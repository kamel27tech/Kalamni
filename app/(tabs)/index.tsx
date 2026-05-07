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
import { getTopics, getAllLevels, getLevelProgress } from '@/lib/content';
import { useProgressStore } from '@/lib/stores/progress';
import type { Unit, Lesson } from '@/types/content';

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isUnitUnlocked(unit: Unit, allUnits: Unit[], completedLessons: string[]): boolean {
  if (!unit.requiresPrevious) return true;
  const sorted = [...allUnits].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((u) => u.id === unit.id);
  if (idx <= 0) return true;
  const prevUnit = sorted[idx - 1];
  return prevUnit.lessons.every((l) => completedLessons.includes(l.id));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const isCompleted = useProgressStore((s) => s.isCompleted);

  function getLessonVariant(
    lessonId: string,
    lessonIndex: number,
    unitLessons: Lesson[],
    unitIsUnlocked: boolean,
  ): 'completed' | 'active' | 'locked' {
    if (!unitIsUnlocked) return 'locked';
    if (isCompleted(lessonId)) return 'completed';
    const firstNonCompleted = unitLessons.findIndex((l) => !isCompleted(l.id));
    if (lessonIndex === firstNonCompleted) return 'active';
    return 'locked';
  }

  const sections = useMemo((): TopicSection[] => {
    const topics = getTopics();
    return topics.map((topic) => {
      const units = [...topic.units].sort((a, b) => a.order - b.order);

      const rows: UnitRow[] = units.map((unit) => {
        const unitIsUnlocked = isUnitUnlocked(unit, units, completedLessons);

        let variant: UnitNodeVariant;
        if (!unitIsUnlocked) {
          variant = 'locked';
        } else if (unit.lessons.length > 0 && unit.lessons.every((l) => completedLessons.includes(l.id))) {
          variant = 'completed';
        } else {
          const hasActiveLesson = unit.lessons.some((lesson, i) =>
            getLessonVariant(lesson.id, i, unit.lessons, unitIsUnlocked) === 'active',
          );
          variant = hasActiveLesson ? 'open' : 'locked';
        }

        return { unit, variant };
      });

      return {
        id: topic.id,
        title: topic.title.en,
        totalUnits: units.length,
        rows,
      };
    });
  }, [completedLessons, isCompleted]);

  const level = useMemo(() => getAllLevels()[0], []);
  const levelTitle = level ? `${level.title.en} Level` : 'Beginner Level';

  const levelProgress = getLevelProgress(level?.id ?? 'level-beginner', completedLessons);
  console.log('[progress-debug] completedLessons:', completedLessons, 'levelProgress:', levelProgress, 'levelId:', level?.id);

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const lessonVariants = useMemo((): Record<string, 'completed' | 'active' | 'locked'> => {
    if (!selectedUnit) return {};
    const topics = getTopics();
    let unitIsUnlocked = true;
    for (const topic of topics) {
      if (topic.units.some((u) => u.id === selectedUnit.id)) {
        unitIsUnlocked = isUnitUnlocked(selectedUnit, topic.units, completedLessons);
        break;
      }
    }
    const lessons = [...selectedUnit.lessons].sort((a, b) => a.order - b.order);
    return Object.fromEntries(
      lessons.map((lesson, i) => [lesson.id, getLessonVariant(lesson.id, i, lessons, unitIsUnlocked)]),
    );
  }, [selectedUnit, completedLessons, isCompleted]);

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
          <LevelBanner levelTitle={levelTitle} progress={levelProgress} />
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
                      variant !== 'locked'
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
        lessonVariants={lessonVariants}
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
