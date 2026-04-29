import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/types/content';
import { ExerciseComponentProps } from '@/types/exercises';
import AnswerOption, { AnswerState } from '@/components/molecules/AnswerOption';
import PromptCard from '@/components/molecules/PromptCard';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type FeedbackState = 'default' | 'correct' | 'wrong';

type Props = ExerciseComponentProps<MultipleChoiceExerciseType['data']> & {
  feedbackState?: FeedbackState;
  onNext?: () => void;
};

function getOptionState(
  optionText: string,
  selectedAnswer: string | string[] | null,
  isLocked: boolean,
  correctAnswer: string
): AnswerState {
  const selected = Array.isArray(selectedAnswer) ? selectedAnswer[0] : selectedAnswer;

  if (!isLocked) {
    return selected === optionText ? 'selected' : 'default';
  }

  if (optionText === correctAnswer) return 'correct';
  if (optionText === selected) return 'wrong';
  return 'default';
}

function isArabic(text: string): boolean {
  return /[؀-ۿ]/.test(text);
}

export default function MultipleChoiceExercise({
  data,
  selectedAnswer,
  isLocked,
  onSelect,
  feedbackState = 'default',
  onNext,
}: Props) {
  const promptLanguage = isArabic(data.prompt) ? 'ar' : 'en';

  const buttonVariant =
    feedbackState === 'correct' ? 'correct' :
    feedbackState === 'wrong' ? 'wrong' : 'primary';

  const arrowColor =
    feedbackState === 'default' ? Colors.text.disabled : Colors.text.negative;

  return (
    <View style={styles.root}>
      {/* Top: instruction + question card */}
      <View style={styles.topSection}>
        <Text style={styles.instructionText}>Please Select The Correct Answer</Text>
        <PromptCard text={data.prompt} language={promptLanguage} />
      </View>

      {/* Bottom: white card with options list + Next button */}
      <View style={styles.bottomCard}>
        <View style={styles.optionsList} accessibilityRole="list">
          {data.options.map((option) => (
            <View key={option.text} accessibilityRole="listitem">
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
                  if (!isLocked) onSelect(option.text);
                }}
              />
            </View>
          ))}
        </View>

        <Button
          label="Next"
          variant={buttonVariant}
          disabled={feedbackState === 'default'}
          onPress={onNext}
          rightIcon={<Icon name="arrow_forward" size={24} color={arrowColor} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  topSection: {
    gap: 16,
  },
  instructionText: {
    ...Typography.english.title.l,
    color: Colors.text.title,
  },
  bottomCard: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 16,
    padding: 20,
    gap: 24,
  },
  optionsList: {
    gap: 12,
  },
});
