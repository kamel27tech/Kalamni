import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/types/content';
import { ExerciseComponentProps } from '@/types/exercises';
import AnswerOption, { AnswerState } from '@/components/molecules/AnswerOption';
import PromptCard from '@/components/molecules/PromptCard';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';

// Detect if text contains Arabic characters
function isArabic(text: string): boolean {
  const arabicRegex = /[؀-ۿ]/;
  return arabicRegex.test(text);
}

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

  const promptLanguage = isArabic(data.prompt) ? 'ar' : 'en';

  return (
    <View style={styles.root}>
      <Text style={styles.instruction}>Please Select The Correct Answer</Text>

      <PromptCard text={data.prompt} language={promptLanguage} />

      <View style={styles.contentContainer}>
        <View style={styles.optionsList}>
          {data.options.map((opt) => (
            <AnswerOption
              key={opt.text}
              state={getOptionState(opt.text)}
              text={opt.text}
              transliteration={opt.transliteration}
              disabled={isLocked}
              isGrouped={false}
              onPress={() => onSelect(opt.text)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  instruction: {
    ...Typography.english.title.l,
    color: Colors.text.heading,
    marginBottom: 16,
  },
  contentContainer: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 16,
    padding: 20,
    gap: 24,
  },
  optionsList: {
    gap: 12,
  },
});
