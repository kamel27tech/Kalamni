import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ExerciseComponentProps } from '@/types/exercises';
import AnswerOption, { AnswerState } from '@/components/molecules/AnswerOption';
import AudioPlayer from '@/components/molecules/AudioPlayer';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type FeedbackState = 'default' | 'correct' | 'wrong';

// audioUrl accepts a URI string (network) or a require() module number (local assets)
export type ListeningData = {
  prompt: string;
  audioUrl: string | number;
  correctAnswerId: string;
  options: Array<{ id: string; text: string; transliteration?: string }>;
};

type Props = ExerciseComponentProps<ListeningData> & {
  feedbackState?: FeedbackState;
  onNext?: () => void;
};

function getOptionState(
  optionId: string,
  selectedAnswer: string | string[] | null,
  isLocked: boolean,
  correctAnswerId: string,
): AnswerState {
  const selected = Array.isArray(selectedAnswer) ? selectedAnswer[0] : selectedAnswer;
  if (!isLocked) return selected === optionId ? 'selected' : 'default';
  if (optionId === correctAnswerId) return 'correct';
  if (optionId === selected) return 'wrong';
  return 'default';
}

export default function ListeningExercise({
  data,
  selectedAnswer,
  isLocked,
  onSelect,
  feedbackState = 'default',
  onNext,
}: Props) {
  const buttonVariant =
    feedbackState === 'correct' ? 'correct' :
    feedbackState === 'wrong'   ? 'wrong'   : 'primary';

  const arrowColor =
    feedbackState === 'default' ? Colors.text.disabled : Colors.text.negative;

  return (
    <View style={styles.root}>
      {/* Top: instruction label + audio player card */}
      <View style={styles.topSection}>
        <Text style={styles.instruction}>{data.prompt}</Text>

        <View style={styles.audioCard}>
          <AudioPlayer audioUrl={data.audioUrl} />
        </View>
      </View>

      {/* Bottom: options + Next CTA — mirrors MultipleChoiceExercise */}
      <View style={styles.bottomCard}>
        <View style={styles.optionsList}>
          {data.options.map((option) => (
            <AnswerOption
              key={option.id}
              state={getOptionState(option.id, selectedAnswer, isLocked, data.correctAnswerId)}
              text={option.text}
              transliteration={option.transliteration}
              disabled={isLocked}
              onPress={() => {
                if (!isLocked) onSelect(option.id);
              }}
            />
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
    backgroundColor: Colors.surface.default,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  topSection: {
    gap: 16,
  },
  instruction: {
    ...Typography.english.title.l,
    color: Colors.text.title,
  },
  audioCard: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 16,
    padding: 24,
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
