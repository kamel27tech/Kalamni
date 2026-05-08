import AppHeader from "@/components/molecules/AppHeader";
import LevelBanner from "@/components/molecules/LevelBanner";
import SectionHeader from "@/components/molecules/SectionHeader";
import UnitNode, { UnitNodeVariant } from "@/components/molecules/UnitNode";
import UnitBottomSheet from "@/components/organisms/UnitBottomSheet";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import {
  getAllLevels,
  getLevelProgress,
  getTopics,
  isTopicComplete,
} from "@/lib/content";
import { useAuthStore } from "@/lib/stores/authStore";
import { useProgressStore } from "@/lib/stores/progress";
import type { Lesson, Topic, Unit } from "@/types/content";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type UnitRow = {
  unit: Unit;
  variant: UnitNodeVariant;
  progress: number;
};

type TopicSection = {
  id: string;
  title: string;
  totalUnits: number;
  rows: UnitRow[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isUnitUnlocked(
  unit: Unit,
  allUnits: Unit[],
  completedLessons: string[],
): boolean {
  if (!unit.requiresPrevious) return true;
  const sorted = [...allUnits].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((u) => u.id === unit.id);
  if (idx <= 0) return true;
  const prevUnit = sorted[idx - 1];
  // An empty previous unit can never be "completed", so progression stops here.
  // Otherwise [].every(...) would return true and unlock every following unit.
  if (prevUnit.lessons.length === 0) return false;
  return prevUnit.lessons.every((l) => completedLessons.includes(l.id));
}

function isTopicUnlocked(
  topic: Topic,
  allTopics: Topic[],
  completedLessons: string[],
): boolean {
  if (!topic.requiresPrevious) return true;
  const sorted = [...allTopics].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((t) => t.id === topic.id);
  if (idx <= 0) return true;
  const prevTopic = sorted[idx - 1];
  return isTopicComplete(prevTopic.id, completedLessons);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userName = user?.name ?? user?.email?.split("@")[0] ?? "";
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const isCompleted = useProgressStore((s) => s.isCompleted);

  function getLessonVariant(
    lessonId: string,
    lessonIndex: number,
    unitLessons: Lesson[],
    unitIsUnlocked: boolean,
  ): "completed" | "active" | "locked" {
    if (!unitIsUnlocked) return "locked";
    if (isCompleted(lessonId)) return "completed";
    const firstNonCompleted = unitLessons.findIndex((l) => !isCompleted(l.id));
    if (lessonIndex === firstNonCompleted) return "active";
    return "locked";
  }

  const sections = useMemo((): TopicSection[] => {
    const topics = getTopics();
    return topics.map((topic) => {
      const units = [...topic.units].sort((a, b) => a.order - b.order);
      const topicIsUnlocked = isTopicUnlocked(topic, topics, completedLessons);

      const rows: UnitRow[] = units.map((unit) => {
        const unitIsUnlocked =
          topicIsUnlocked && isUnitUnlocked(unit, units, completedLessons);

        const total = unit.lessons.length;
        const done = unit.lessons.filter((l) =>
          completedLessons.includes(l.id),
        ).length;
        const progress = total > 0 ? done / total : 0;

        let variant: UnitNodeVariant;
        if (!unitIsUnlocked) {
          variant = "locked";
        } else if (total === 0) {
          // Unit has no lessons yet (placeholder content). Show as open so users
          // see it's reachable; the bottom sheet will reflect the empty state.
          variant = "open";
        } else if (done === total) {
          variant = "completed";
        } else if (done > 0) {
          variant = "not_completed";
        } else {
          variant = "open";
        }

        return { unit, variant, progress };
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
  const levelTitle = level ? `${level.title.en} Level` : "Beginner Level";

  const levelProgress = getLevelProgress(
    level?.id ?? "level-beginner",
    completedLessons,
  );

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const lessonVariants = useMemo((): Record<
    string,
    "completed" | "active" | "locked"
  > => {
    if (!selectedUnit) return {};
    const topics = getTopics();
    let unitIsUnlocked = true;
    for (const topic of topics) {
      if (topic.units.some((u) => u.id === selectedUnit.id)) {
        unitIsUnlocked =
          isTopicUnlocked(topic, topics, completedLessons) &&
          isUnitUnlocked(selectedUnit, topic.units, completedLessons);
        break;
      }
    }
    const lessons = [...selectedUnit.lessons].sort((a, b) => a.order - b.order);
    return Object.fromEntries(
      lessons.map((lesson, i) => [
        lesson.id,
        getLessonVariant(lesson.id, i, lessons, unitIsUnlocked),
      ]),
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
    <View style={styles.safe}>
      {/* App header — white wrapper extends flush to the status bar */}
      <View style={[styles.headerWrapper, { paddingTop: top }]}>
        <AppHeader
          variant="free"
          isHomePage={true}
          userName={userName}
          style={styles.headerNoShadow}
        />
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
              {section.rows.map(({ unit, variant, progress }, index) => (
                <React.Fragment key={unit.id}>
                  {index > 0 && (
                    <View
                      style={[
                        styles.unitDivider,
                        section.rows[index - 1].variant === "completed" &&
                          styles.unitDividerComplete,
                      ]}
                    />
                  )}
                  <UnitNode
                    variant={variant}
                    type="unit"
                    title={unit.title.en}
                    progress={progress}
                    onPress={
                      variant !== "locked" && unit.lessons.length > 0
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
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface.default,
  },
  headerWrapper: {
    backgroundColor: Colors.surface.subtle,
  },
  headerNoShadow: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    width: 5,
    borderRadius: 10,
    backgroundColor: Colors.border.default,
  },
  unitDividerComplete: {
    backgroundColor: Colors.success.surface,
  },
  bottomPad: {
    height: Spacing.xxl,
  },
});
