import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/atoms/Icon';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props =
  | { state: 'correct'; successMessage?: string; style?: ViewStyle }
  | {
      state: 'wrong';
      correctAnswer: string;
      correctAnswerLabel?: string;
      wrongMessage?: string;
      style?: ViewStyle;
    };

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeedbackContainer(props: Props) {
  const message =
    props.state === 'correct'
      ? (props.successMessage ?? 'Well done!')
      : (props.wrongMessage ?? 'Wrong Answer!');

  const bgColor =
    props.state === 'correct' ? Colors.success.surfaceSubtle : Colors.error.surfaceSubtle;
  const iconBg =
    props.state === 'correct' ? Colors.success.surface : Colors.error.surface;
  const textColor =
    props.state === 'correct' ? Colors.success.text : Colors.error.text;

  const a11yLabel =
    props.state === 'correct'
      ? `Correct answer. ${message}`
      : `Wrong answer. Correct answer: ${props.correctAnswer}`;

  return (
    <View
      style={[styles.container, { backgroundColor: bgColor }, props.style]}
      accessibilityRole="alert"
      accessibilityLabel={a11yLabel}
    >
      {/* Status row: icon + message */}
      <View style={styles.row}>
        <View
          style={[styles.iconCircle, { backgroundColor: iconBg }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Icon
            name={props.state === 'correct' ? 'check' : 'close'}
            size={14}
            color={Colors.text.negative}
          />
        </View>
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      </View>

      {/* Correct answer reveal — wrong state only */}
      {props.state === 'wrong' && (
        <View style={styles.answerSection}>
          <Text style={[styles.answerLabel, { color: textColor }]}>
            {props.correctAnswerLabel ?? 'Correct Answer:'}
          </Text>
          <Text style={[styles.answerText, { color: textColor }]}>
            {props.correctAnswer}
          </Text>
        </View>
      )}

      {/* Spacer — matches Figma bottom area, maintains visual weight */}
      <View style={styles.spacer} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...Typography.english.title.l,
  },
  answerSection: {
    gap: 12,
  },
  answerLabel: {
    ...Typography.english.title.m,
  },
  answerText: {
    ...Typography.arabic.body.mSemi,
    textAlign: 'right',
    width: '100%',
  },
  spacer: {
    height: 64,
  },
});
