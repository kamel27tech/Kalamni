// lib/content.ts
// Helper functions for reading and querying course content

import course from '@/data/course.json';
import type {
  Course,
  Level,
  Topic,
  Unit,
  Lesson,
  Exercise,
} from '@/types/content';

const typedCourse = course as Course;

// ============================================
// LEVEL HELPERS
// ============================================

export function getAllLevels(): Level[] {
  return [...typedCourse.levels].sort((a, b) => a.order - b.order);
}

export function getLevelById(levelId: string): Level | undefined {
  return typedCourse.levels.find((l) => l.id === levelId);
}

// ============================================
// TOPIC HELPERS
// ============================================

// Returns all topics under Level 1 (the first level by order), with units and lessons.
export function getTopics(): Topic[] {
  const first = getAllLevels()[0];
  return first ? [...first.topics].sort((a, b) => a.order - b.order) : [];
}

export function getTopicsByLevel(levelId: string): Topic[] {
  const level = getLevelById(levelId);
  return level ? [...level.topics].sort((a, b) => a.order - b.order) : [];
}

export function getTopicById(topicId: string): Topic | undefined {
  for (const level of typedCourse.levels) {
    const topic = level.topics.find((t) => t.id === topicId);
    if (topic) return topic;
  }
  return undefined;
}

// ============================================
// UNIT HELPERS
// ============================================

export function getUnitsByTopic(topicId: string): Unit[] {
  const topic = getTopicById(topicId);
  return topic ? [...topic.units].sort((a, b) => a.order - b.order) : [];
}

export function getUnitById(unitId: string): Unit | undefined {
  for (const level of typedCourse.levels) {
    for (const topic of level.topics) {
      const unit = topic.units.find((u) => u.id === unitId);
      if (unit) return unit;
    }
  }
  return undefined;
}

// ============================================
// LESSON HELPERS
// ============================================

export function getLessonsByUnit(unitId: string): Lesson[] {
  const unit = getUnitById(unitId);
  return unit ? [...unit.lessons].sort((a, b) => a.order - b.order) : [];
}

export function getLessonById(lessonId: string): Lesson | undefined {
  for (const level of typedCourse.levels) {
    for (const topic of level.topics) {
      for (const unit of topic.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
      }
    }
  }
  return undefined;
}

// ============================================
// EXERCISE HELPERS
// ============================================

export function getExercisesByLesson(lessonId: string): Exercise[] {
  const lesson = getLessonById(lessonId);
  return lesson ? [...lesson.exercises].sort((a, b) => a.order - b.order) : [];
}

// ============================================
// BREADCRUMB HELPER — find full path for any lesson
// ============================================

export type Breadcrumb = {
  level: Level;
  topic: Topic;
  unit: Unit;
  lesson: Lesson;
};

export function getBreadcrumb(lessonId: string): Breadcrumb | null {
  for (const level of typedCourse.levels) {
    for (const topic of level.topics) {
      for (const unit of topic.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return { level, topic, unit, lesson };
      }
    }
  }
  return null;
}

// ============================================
// FORCED-PATH / UNLOCK HELPERS
// ============================================

export function isLessonComplete(
  lessonId: string,
  completedLessonIds: string[]
): boolean {
  return completedLessonIds.includes(lessonId);
}

export function isUnitComplete(
  unitId: string,
  completedLessonIds: string[]
): boolean {
  const unit = getUnitById(unitId);
  if (!unit || unit.lessons.length === 0) return false;
  return unit.lessons.every((l) => completedLessonIds.includes(l.id));
}

export function isTopicComplete(
  topicId: string,
  completedLessonIds: string[]
): boolean {
  const topic = getTopicById(topicId);
  if (!topic || topic.units.length === 0) return false;
  return topic.units.every((u) => isUnitComplete(u.id, completedLessonIds));
}

export function isLessonUnlocked(
  lessonId: string,
  completedLessonIds: string[]
): boolean {
  const crumb = getBreadcrumb(lessonId);
  if (!crumb) return false;

  // Always unlocked if no prerequisite required
  if (!crumb.lesson.requiresPrevious) return true;

  const lessons = [...crumb.unit.lessons].sort((a, b) => a.order - b.order);
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);

  // If this is the first lesson of its unit, check if previous unit is complete
  if (currentIndex === 0) {
    return isPreviousUnitComplete(crumb, completedLessonIds);
  }

  // Otherwise, the previous lesson in this unit must be complete
  const previousLesson = lessons[currentIndex - 1];
  return completedLessonIds.includes(previousLesson.id);
}

export function isUnitUnlocked(
  unitId: string,
  completedLessonIds: string[]
): boolean {
  const unit = getUnitById(unitId);
  if (!unit) return false;
  if (!unit.requiresPrevious) return true;

  // Find parent topic
  for (const level of typedCourse.levels) {
    for (const topic of level.topics) {
      const units = [...topic.units].sort((a, b) => a.order - b.order);
      const index = units.findIndex((u) => u.id === unitId);
      if (index === -1) continue;
      if (index === 0) return true; // first unit is always unlocked
      const previousUnit = units[index - 1];
      return isUnitComplete(previousUnit.id, completedLessonIds);
    }
  }
  return false;
}

export function isTopicUnlocked(
  topicId: string,
  completedLessonIds: string[]
): boolean {
  const topic = getTopicById(topicId);
  if (!topic) return false;
  if (!topic.requiresPrevious) return true;

  for (const level of typedCourse.levels) {
    const topics = [...level.topics].sort((a, b) => a.order - b.order);
    const index = topics.findIndex((t) => t.id === topicId);
    if (index === -1) continue;
    if (index === 0) return true;
    const previousTopic = topics[index - 1];
    return isTopicComplete(previousTopic.id, completedLessonIds);
  }
  return false;
}

// Helper used internally
function isPreviousUnitComplete(
  crumb: Breadcrumb,
  completedLessonIds: string[]
): boolean {
  const units = [...crumb.topic.units].sort((a, b) => a.order - b.order);
  const unitIndex = units.findIndex((u) => u.id === crumb.unit.id);
  if (unitIndex === 0) return true;
  const previousUnit = units[unitIndex - 1];
  return isUnitComplete(previousUnit.id, completedLessonIds);
}

// ============================================
// PROGRESS CALCULATION
// ============================================

export function getTopicProgress(
  topicId: string,
  completedLessonIds: string[]
): { completed: number; total: number; percent: number } {
  const topic = getTopicById(topicId);
  if (!topic) return { completed: 0, total: 0, percent: 0 };

  let total = 0;
  let completed = 0;
  for (const unit of topic.units) {
    for (const lesson of unit.lessons) {
      total += 1;
      if (completedLessonIds.includes(lesson.id)) completed += 1;
    }
  }
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getUnitProgress(
  unitId: string,
  completedLessonIds: string[]
): { completed: number; total: number; percent: number } {
  const unit = getUnitById(unitId);
  if (!unit) return { completed: 0, total: 0, percent: 0 };

  const total = unit.lessons.length;
  const completed = unit.lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}