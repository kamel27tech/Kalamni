import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/atoms/Button';
import HeaderActivity from '@/components/molecules/HeaderActivity';
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';
import ListeningExercise from '@/components/exercises/ListeningExercise';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import lessonData from '@/data/lesson.json';
import { Exercise } from '@/types/content';

// Cast the JSON to the typed Exercise array — lesson.json is the authoritative test fixture
const exercises = [...(lessonData.exercises as Exercise[])].sort(
  (a, b) => a.order - b.order,
);

// Maps audio paths from lesson.json to bundled local assets.
// expo-av cannot resolve bare relative string paths — require() gives the module ID.
const AUDIO_MAP: Record<string, number> = {
  'assets/audio/greeting-hello.mp3': require('@/assets/audio/greeting-hello.mp3'),
};

function resolveAudio(url: string): string | number {
  return AUDIO_MAP[url] ?? url;
}

type LessonStatus = 'playing' | 'complete';

// Returns the value to compare against the selected answer for each exercise type.
function getCorrectAnswer(exercise: Exercise): string {
  if (exercise.type === 'multiple-choice') return exercise.data.correctAnswer;
  if (exercise.type === 'listening') return exercise.data.correctAnswerId;
  return '';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LessonPlayer() {
  const router = useRouter();

  // ── Lesson-level state ────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);
  const [status, setStatus] = useState<LessonStatus>('playing');

  // ── Exercise-level controlled state (reset on every advance) ──────────────
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentExercise = exercises[currentIndex];
  const progress = status === 'complete' ? 1 : currentIndex / exercises.length;

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Called immediately when the user taps an option — locks and shows feedback.
  const handleSelect = (answer: string | string[]) => {
    setSelectedAnswer(answer);
    setIsLocked(true);
    const correct = answer === getCorrectAnswer(currentExercise);
    setIsCorrect(correct);
  };

  // Advances to the next exercise (or completes the lesson).
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

  // ── Exercise renderer ─────────────────────────────────────────────────────
  function renderExercise() {
    const exercise = currentExercise;
    const feedbackState =
      selectedAnswer === null ? 'default' : isCorrect ? 'correct' : 'wrong';

    if (exercise.type === 'multiple-choice') {
      return (
        <MultipleChoiceExercise
          key={exercise.id}
          data={exercise.data}
          selectedAnswer={selectedAnswer}
          isLocked={isLocked}
          onSelect={handleSelect}
          feedbackState={feedbackState}
          onNext={handleNext}
        />
      );
    }

    if (exercise.type === 'listening') {
      return (
        <ListeningExercise
          key={exercise.id}
          data={{ ...exercise.data, audioUrl: resolveAudio(exercise.data.audioUrl) }}
          selectedAnswer={selectedAnswer}
          isLocked={isLocked}
          onSelect={handleSelect}
          feedbackState={feedbackState}
          onNext={handleNext}
        />
      );
    }

    // Placeholder for exercise types not yet implemented (matching-pairs, tap-to-build)
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.exerciseIndex}>
          Exercise {currentIndex + 1} of {exercises.length}
        </Text>
        <Text style={styles.exerciseType}>Type: {exercise.type}</Text>
        <Button label="Skip" variant="secondary" onPress={handleNext} />
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
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

      {/* Content */}
      <View style={styles.content}>
        {status === 'complete' ? (
          <View style={styles.centeredContent}>
            <Text style={styles.completeText}>Lesson Complete!</Text>
            <Button
              label="Back to Home"
              variant="primary"
              onPress={() => router.replace('/')}
            />
          </View>
        ) : (
          renderExercise()
        )}
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
  content: {
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
});
