import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Button from '@/components/atoms/Button';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/atoms/Icon';

type FeedbackState = 'default' | 'correct' | 'wrong';

type FeedbackContainerProps = {
  state: FeedbackState;
  onNext?: () => void;
  correctAnswer?: string;
  style?: ViewStyle;
};

function getMessage(state: FeedbackState): string {
  if (state === 'correct') return 'Great job! That's correct.';
  if (state === 'wrong') return 'That's not right. Try again!';
  return 'Select an answer to continue.';
}

function getIcon(state: FeedbackState): React.ReactNode {
  if (state === 'correct') {
    return <Icon name="check_circle" size={24} color={Colors.success.surface} />;
  }
  if (state === 'wrong') {
    return <Icon name="cancel" size={24} color={Colors.error.surface} />;
  }
  return null;
}

function getButtonVariant(state: FeedbackState): 'primary' | 'correct' | 'wrong' {
  if (state === 'correct') return 'correct';
  if (state === 'wrong') return 'wrong';
  return 'primary';
}

export default function FeedbackContainer({
  state = 'default',
  onNext,
  correctAnswer,
  style,
}: FeedbackContainerProps) {
  const isAnswered = state !== 'default';
  const icon = getIcon(state);

  return (
    <View style={[styles.root, style]}>
      {isAnswered ? (
        <>
          <View style={styles.feedbackRow}>
            {icon}
            <Text style={styles.feedbackText}>{getMessage(state)}</Text>
          </View>

          {state === 'wrong' && correctAnswer && (
            <View style={styles.correctAnswerRow}>
              <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
              <Text style={styles.correctAnswerText}>{correctAnswer}</Text>
            </View>
          )}

          <Button
            label="Next"
            variant={getButtonVariant(state)}
            onPress={onNext}
            disabled={!onNext}
          />
        </>
      ) : (
        <Text style={styles.promptText}>{getMessage(state)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackText: {
    ...Typography.english.body.m,
    color: Colors.text.body,
    flex: 1,
  },
  correctAnswerRow: {
    gap: 4,
  },
  correctAnswerLabel: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
  },
  correctAnswerText: {
    ...Typography.arabic.title.m,
    color: Colors.text.title,
    textAlign: 'right',
  },
  promptText: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
    textAlign: 'center',
  },
});
