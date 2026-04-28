import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/types/content';
import { ExerciseComponentProps } from '@/types/exercises';
import AnswerOption from '@/components/molecules/AnswerOption';
import PromptCard from '@/components/molecules/PromptCard';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

type Props = ExerciseComponentProps<MultipleChoiceExerciseType['data']>;

function isArabic(text: string): boolean {
  return /[؀-ۿ]/.test(text);
}

export default function MultipleChoiceExercise({
  data,
  selectedAnswer,
  isLocked,
  onSelect,
}: Props) {
  const [hasChecked, setHasChecked] = useState(false);
  const isCorrect = selectedAnswer === data.correctAnswer;

  // Derive button/feedback visibility
  const showCheck = selectedAnswer !== null && !hasChecked && !isLocked;
  const showFeedback = hasChecked && isLocked;

  const handleCheck = () => {
    setHasChecked(true);
  };

  const handleNext = () => {
    onSelect(selectedAnswer!);
  };

  const promptLanguage = isArabic(data.prompt) ? 'ar' : 'en';

  return (
    <View style={styles.root}>
      {/* Top: Question */}
      <PromptCard text={data.prompt} language={promptLanguage} />

      {/* Middle: Options */}
      <View style={styles.optionsContainer}>
        {data.options.map((opt) => (
          <AnswerOption
            key={opt.text}
            state={
              !isLocked
                ? selectedAnswer === opt.text
                  ? 'selected'
                  : 'default'
                : opt.text === data.correctAnswer
                ? 'correct'
                : selectedAnswer === opt.text
                ? 'wrong'
                : 'default'
            }
            text={opt.text}
            transliteration={opt.transliteration}
            disabled={isLocked}
            onPress={() => {
              if (!isLocked) {
                onSelect(opt.text);
              }
            }}
          />
        ))}
      </View>

      {/* Bottom: Check button or Feedback panel */}
      <View style={styles.bottomArea}>
        {showFeedback ? (
          <View
            style={[
              styles.feedbackPanel,
              isCorrect ? styles.correctPanel : styles.wrongPanel,
            ]}
          >
            {/* Feedback content */}
            <View style={styles.feedbackContent}>
              <View style={styles.feedbackHeader}>
                <Icon
                  name={isCorrect ? 'check' : 'close'}
                  size={24}
                  color={isCorrect ? Colors.success.text : Colors.error.text}
                />
                <Text
                  style={[
                    styles.feedbackMessage,
                    {
                      color: isCorrect
                        ? Colors.success.text
                        : Colors.error.text,
                    },
                  ]}
                >
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </Text>
              </View>

              {/* Show correct answer if wrong */}
              {!isCorrect && (
                <View style={styles.correctAnswerSection}>
                  <Text
                    style={[
                      styles.correctAnswerLabel,
                      { color: Colors.error.text },
                    ]}
                  >
                    Correct Answer:
                  </Text>
                  <Text
                    style={[
                      styles.correctAnswerText,
                      { color: Colors.error.text },
                    ]}
                  >
                    {data.correctAnswer}
                  </Text>
                </View>
              )}
            </View>

            {/* Next button */}
            <Button
              label="Next"
              variant={isCorrect ? 'success' : 'danger'}
              onPress={handleNext}
              rightIcon={
                <Icon
                  name="arrow_forward"
                  size={24}
                  color={Colors.icon.negative}
                />
              }
              style={styles.nextButton}
            />
          </View>
        ) : showCheck ? (
          <Button
            label="Check"
            variant="primary"
            onPress={handleCheck}
            style={styles.checkButton}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    justifyContent: 'space-between',
  },
  optionsContainer: {
    gap: Math.round(Spacing.md),
  },
  bottomArea: {
    minHeight: 0,
  },
  checkButton: {
    alignSelf: 'stretch',
  },
  feedbackPanel: {
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  correctPanel: {
    backgroundColor: Colors.success.surfaceSubtle,
  },
  wrongPanel: {
    backgroundColor: Colors.error.surfaceSubtle,
  },
  feedbackContent: {
    gap: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackMessage: {
    ...Typography.english.title.l,
  },
  correctAnswerSection: {
    gap: 8,
  },
  correctAnswerLabel: {
    ...Typography.english.title.m,
  },
  correctAnswerText: {
    ...Typography.arabic.title.l,
    textAlign: 'right',
  },
  nextButton: {
    alignSelf: 'stretch',
  },
});
