import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '@/components/atoms/Button';
import HeaderActivity from '@/components/molecules/HeaderActivity';
import FeedbackContainer from '@/components/molecules/FeedbackContainer';
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { getLessonById, getExercisesByLesson } from '@/lib/content';
import { Exercise } from '@/types/content';

type LessonStatus = 'playing' | 'complete';

// Returns the correct answer string for exercise types that have one.
function getCorrectAnswer(exercise: Exercise): string {
  if (exercise.type === 'multiple-choice' || exercise.type === 'listening') {
    return exercise.data.correctAnswer;
  }
  return '';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LessonPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const lesson = getLessonById(id);
  const exercises = getExercisesByLesson(id);

  // ── Lesson-level state ────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);
  const [status, setStatus] = useState<LessonStatus>('playing');

  // ── Exercise-level controlled state (reset on every advance) ──────────────
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // ── Error states ──────────────────────────────────────────────────────────
  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centeredContent}>
          <Text style={styles.messageText}>Lesson not found</Text>
          <Button label="Go Back" variant="primary" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centeredContent}>
          <Text style={styles.messageText}>No exercises in this lesson yet</Text>
          <Button label="Go Back" variant="primary" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = status === 'complete' ? 1 : currentIndex / exercises.length;

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Called immediately when the user taps an option — locks the exercise and
  // shows feedback without requiring a separate submit tap.
  const handleSelect = (answer: string | string[]) => {
    setSelectedAnswer(answer);
    setIsLocked(true);
    const correct = answer === getCorrectAnswer(currentExercise);
    setIsCorrect(correct);
  };

  // Advances to the next exercise (or completes the lesson).
  // isLocked is always true when this can be called (button is disabled otherwise).
  const handleNext = () => {
    setAnswerHistory((prev) => [...prev, isCorrect!]);
    setSelectedAnswer(null);
    setIsLocked(false);
    setIsCorrect(null);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStatus('complete');
    }
  };

  // ── Exercise renderer — extend this switch for new types ──────────────────
  function renderExercise() {
    const exercise = currentExercise;
    if (exercise.type === 'multiple-choice') {
      return (
        <MultipleChoiceExercise
          key={exercise.id}
          data={exercise.data}
          selectedAnswer={selectedAnswer}
          isLocked={isLocked}
          onSelect={handleSelect}
        />
      );
    }
    // Placeholder for unimplemented exercise types
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.exerciseIndex}>
          Exercise {currentIndex + 1} of {exercises.length}
        </Text>
        <Text style={styles.exerciseType}>Type: {exercise.type}</Text>
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <HeaderActivity
          progress={progress}
          currentStep={currentIndex + 1}
          totalSteps={exercises.length}
          rightIconName="flag"
          rightIconColor={Colors.success.surface}
          onClose={() => router.back()}
        />
      </View>

      {/* Middle — exercise or completion message */}
      <View style={styles.middle}>
        {status === 'complete' ? (
          <View style={styles.centeredContent}>
            <Text style={styles.completeText}>Lesson Complete!</Text>
          </View>
        ) : (
          renderExercise()
        )}
      </View>

      {/* Bottom feedback + button area */}
      <View style={styles.bottomContainer}>
        <View style={styles.feedbackCard}>
          {status === 'complete' ? (
            <Button
              label="Back to Home"
              variant="primary"
              onPress={() => router.replace('/')}
            />
          ) : selectedAnswer === null ? (
            <FeedbackContainer state="default" style={styles.feedbackContent} />
          ) : isCorrect ? (
            <FeedbackContainer
              state="correct"
              onNext={handleNext}
              style={styles.feedbackContent}
            />
          ) : (
            <FeedbackContainer
              state="wrong"
              correctAnswer={getCorrectAnswer(currentExercise)}
              onNext={handleNext}
              style={styles.feedbackContent}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface.default,
  },
  headerContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  middle: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  exerciseIndex: {
    ...Typography.english.body.l,
    color: Colors.text.body,
    textAlign: 'center',
  },
  exerciseType: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
    textAlign: 'center',
  },
  completeText: {
    ...Typography.english.heading.h2,
    color: Colors.text.heading,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  feedbackCard: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 16,
    padding: Spacing.md,
  },
  feedbackContent: {},
  messageText: {
    ...Typography.english.body.l,
    color: Colors.text.body,
    textAlign: 'center',
  },
});
