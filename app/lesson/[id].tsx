import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import HeaderActivity from '@/components/molecules/HeaderActivity';
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';
import ListeningExercise from '@/components/exercises/ListeningExercise';
import MatchingPairsExercise from '@/components/exercises/MatchingPairsExercise';
import TapToBuildExercise from '@/components/exercises/TapToBuildExercise';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
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

// Returns the value to compare against the selected answer for each exercise type.
function getCorrectAnswer(exercise: Exercise): string {
  if (exercise.type === 'multiple-choice') return exercise.data.correctAnswer;
  if (exercise.type === 'listening') return exercise.data.correctAnswerId;
  return '';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LessonPlayer() {
  const router = useRouter();
  const { id: lessonId } = useLocalSearchParams<{ id: string }>();

  // ── Lesson-level state ────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);

  // ── Elapsed time — useRef avoids re-renders on every tick ─────────────────
  const elapsedRef = useRef(0);
  useEffect(() => {
    const id = setInterval(() => { elapsedRef.current += 1; }, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Exercise-level controlled state (reset on every advance) ──────────────
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentExercise = exercises[currentIndex];
  const progress = currentIndex / exercises.length;

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Called immediately when the user taps an option — locks and shows feedback.
  const handleSelect = (answer: string | string[]) => {
    setSelectedAnswer(answer);
    setIsLocked(true);
    const correct = answer === getCorrectAnswer(currentExercise);
    setIsCorrect(correct);
  };

  // Called on each pair match — locks only when all pairs are matched.
  const handleMatchingPairsSelect = (answer: string | string[]) => {
    setSelectedAnswer(answer);
    const exercise = currentExercise;
    if (exercise.type === 'matching-pairs') {
      const matchedCount = Array.isArray(answer) ? answer.length : 1;
      if (matchedCount === exercise.data.pairs.length) {
        setIsLocked(true);
        setIsCorrect(true);
      }
    }
  };

  // Called as the user taps words — updates order without locking.
  const handleTapToBuildSelect = (answer: string | string[]) => {
    setSelectedAnswer(answer);
  };

  // Called when the user taps Check — locks and evaluates order.
  const handleTapToBuildCheck = () => {
    const exercise = currentExercise;
    if (exercise.type !== 'tap-to-build') return;
    const words = exercise.data.wordBank.map((text, i) => ({ id: `w-${i}`, text }));
    const ids = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    const selectedTexts = ids.map((id) => words.find((w) => w.id === id)?.text ?? '');
    const correct =
      selectedTexts.length === exercise.data.correctAnswer.length &&
      selectedTexts.every((text, i) => text === exercise.data.correctAnswer[i]);
    setIsLocked(true);
    setIsCorrect(correct);
  };

  // Advances to the next exercise, or navigates to summary on completion.
  const handleNext = () => {
    const wasCorrect = isCorrect!;
    setAnswerHistory((prev) => [...prev, wasCorrect]);
    setSelectedAnswer(null);
    setIsLocked(false);
    setIsCorrect(null);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalCorrect = answerHistory.filter(Boolean).length + (wasCorrect ? 1 : 0);
      router.replace({
        pathname: '/lesson/summary',
        params: {
          correct: String(finalCorrect),
          total: String(exercises.length),
          lessonId: lessonId ?? '',
          elapsed: String(elapsedRef.current),
        },
      });
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

    if (exercise.type === 'matching-pairs') {
      return (
        <MatchingPairsExercise
          key={exercise.id}
          data={exercise.data}
          selectedAnswer={selectedAnswer}
          isLocked={isLocked}
          onSelect={handleMatchingPairsSelect}
          onNext={handleNext}
        />
      );
    }

    if (exercise.type === 'tap-to-build') {
      const words = exercise.data.wordBank.map((text, i) => ({ id: `w-${i}`, text }));
      const correctOrder = exercise.data.correctAnswer.map(
        (text) => words.find((w) => w.text === text)?.id ?? text,
      );
      return (
        <TapToBuildExercise
          key={exercise.id}
          data={{ prompt: exercise.data.prompt, words, correctOrder }}
          selectedAnswer={selectedAnswer}
          isLocked={isLocked}
          onSelect={handleTapToBuildSelect}
          onCheck={handleTapToBuildCheck}
          onNext={handleNext}
        />
      );
    }

    return null;
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
        {renderExercise()}
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
});
