import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/types/content';
import { ExerciseComponentProps } from '@/types/exercises';
import AnswerOption, { AnswerState } from '@/components/molecules/AnswerOption';
import PromptCard from '@/components/molecules/PromptCard';
import { Spacing } from '@/constants/spacing';

type Props = ExerciseComponentProps<MultipleChoiceExerciseType['data']>;

// Helper: Derive option state based on props (no internal state)
function getOptionState(
  optionText: string,
  selectedAnswer: string | string[] | null,
  isLocked: boolean,
  correctAnswer: string
): AnswerState {
  const selected = Array.isArray(selectedAnswer) ? selectedAnswer[0] : selectedAnswer;

  // Not locked: show selected or default
  if (!isLocked) {
    return selected === optionText ? 'selected' : 'default';
  }

  // Locked: show correct/wrong states
  if (optionText === correctAnswer) {
    return 'correct';
  }
  if (optionText === selected) {
    return 'wrong';
  }
  return 'default';
}

// Detect if text is Arabic
function isArabic(text: string): boolean {
  return /[؀-ۿ]/.test(text);
}

export default function MultipleChoiceExercise({
  data,
  selectedAnswer,
  isLocked,
  onSelect,
}: Props) {
  const promptLanguage = isArabic(data.prompt) ? 'ar' : 'en';

  return (
    <View style={styles.root}>
      {/* Question prompt */}
      <PromptCard text={data.prompt} language={promptLanguage} />

      {/* Answer options list */}
      <View
        style={styles.optionsList}
        accessibilityRole="list"
      >
        {data.options.map((option) => (
          <View
            key={option.text}
            accessibilityRole="listitem"
          >
            <AnswerOption
              state={getOptionState(
                option.text,
                selectedAnswer,
                isLocked,
                data.correctAnswer
              )}
              text={option.text}
              transliteration={option.transliteration}
              disabled={isLocked}
              onPress={() => {
                if (!isLocked) {
                  onSelect(option.text);
                }
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Math.round(Spacing.md),
  },
  optionsList: {
    gap: Math.round(Spacing.sm),
  },
});
