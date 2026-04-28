import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props =
  | {
      state: 'default';
      buttonLabel?: string;
      style?: ViewStyle;
    }
  | {
      state: 'correct';
      successMessage?: string;
      buttonLabel?: string;
      onNext: () => void;
      style?: ViewStyle;
    }
  | {
      state: 'wrong';
      correctAnswer: string;
      correctAnswerLabel?: string;
      wrongMessage?: string;
      buttonLabel?: string;
      onNext: () => void;
      style?: ViewStyle;
    };

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeedbackContainer(props: Props) {
  if (props.state === 'default') {
    return (
      <View style={[styles.defaultContainer, props.style]}>
        <Button
          label={props.buttonLabel ?? 'Next'}
          variant="primary"
          disabled={true}
          rightIcon={<Icon name="arrow_forward" size={24} color={Colors.icon.disabled} />}
        />
      </View>
    );
  }

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
  const buttonVariant = props.state === 'correct' ? 'correct' : 'wrong';

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
          <Text
            style={[
              styles.answerText,
              { color: textColor },
              Typography.arabic.title.l,
            ]}
            numberOfLines={2}
          >
            {props.correctAnswer}
          </Text>
        </View>
      )}

      {/* Next button */}
      <Button
        label={props.buttonLabel ?? 'Next'}
        variant={buttonVariant}
        rightIcon={
          <Icon
            name="arrow_forward"
            size={24}
            color={Colors.icon.negative}
          />
        }
        onPress={props.onNext}
        style={styles.button}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  defaultContainer: {
    alignSelf: 'stretch',
  },
  container: {
    borderRadius: 20,
    padding: 20,
    gap: 20,
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
    flexShrink: 0,
  },
  message: {
    ...Typography.english.title.l,
    flex: 1,
  },
  answerSection: {
    gap: 12,
  },
  answerLabel: {
    ...Typography.english.title.m,
  },
  answerText: {
    textAlign: 'right',
    width: '100%',
  },
  button: {
    alignSelf: 'stretch',
  },
});
