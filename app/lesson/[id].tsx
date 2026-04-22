import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import HeaderActivity from '@/components/molecules/HeaderActivity';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { getLessonById, getExercisesByLesson } from '@/lib/content';

type LessonStatus = 'playing' | 'complete';

export default function LessonPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const lesson = getLessonById(id);
  const exercises = getExercisesByLesson(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);
  const [status, setStatus] = useState<LessonStatus>('playing');

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.messageText}>Lesson not found</Text>
          <Button label="Go Back" variant="primary" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.messageText}>No exercises in this lesson yet</Text>
          <Button label="Go Back" variant="primary" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = status === 'complete' ? 1 : currentIndex / exercises.length;

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStatus('complete');
    }
  };

  const nextLabel =
    currentIndex < exercises.length - 1
      ? `Next exercise, ${currentIndex + 2} of ${exercises.length}`
      : 'Finish lesson';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top bar */}
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

      {/* Middle area — Phase 1 placeholder */}
      <View style={styles.middle}>
        {status === 'complete' ? (
          <Text style={styles.completeText}>Lesson Complete!</Text>
        ) : (
          <>
            <Text style={styles.exerciseIndex}>
              Exercise {currentIndex + 1} of {exercises.length}
            </Text>
            <Text style={styles.exerciseType}>Type: {currentExercise.type}</Text>
          </>
        )}
      </View>

      {/* Bottom button area */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonCard}>
          {status === 'complete' ? (
            <Button
              label="Back to Home"
              variant="primary"
              accessibilityLabel="Return to home screen"
              onPress={() => router.replace('/')}
            />
          ) : (
            <Button
              label="Next"
              variant="primary"
              rightIcon={
                <Icon name="arrow_forward" size={24} color={Colors.icon.negative} />
              }
              accessibilityLabel={nextLabel}
              onPress={handleNext}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  buttonCard: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 16,
    padding: Spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  messageText: {
    ...Typography.english.body.l,
    color: Colors.text.body,
    textAlign: 'center',
  },
});
