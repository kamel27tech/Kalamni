import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/types/content';
import { ExerciseComponentProps } from '@/types/exercises';
import AnswerOption, { AnswerState } from '@/components/molecules/AnswerOption';
import PromptCard from '@/components/molecules/PromptCard';
import { Spacing } from '@/constants/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = ExerciseComponentProps<MultipleChoiceExerciseType['data']>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MultipleChoiceExercise({ data, selectedAnswer, isLocked, onSelect }: Props) {
  // Narrow to string for single-choice comparison; string[] branch is unused here.
  const selected = Array.isArray(selectedAnswer) ? selectedAnswer[0] : selectedAnswer;

  function getOptionState(optionText: string): AnswerState {
    if (!isLocked) {
      return selected === optionText ? 'selected' : 'default';
    }
    if (optionText === data.correctAnswer) return 'correct';
    if (optionText === selected) return 'wrong';
    return 'default';
  }

  return (
    <View style={styles.root}>
      <PromptCard text={data.prompt} />

      <View style={styles.spacer} />

      <View style={styles.optionList}>
        {data.options.map((opt) => (
          <AnswerOption
            key={opt.text}
            state={getOptionState(opt.text)}
            text={opt.text}
            transliteration={opt.transliteration}
            disabled={isLocked}
            onPress={() => onSelect(opt.text)}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  spacer: {
    flex: 1,
  },
  optionList: {
    gap: 12,
  },
});
