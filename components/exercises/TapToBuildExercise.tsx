import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExerciseComponentProps } from '@/types/exercises';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TapToBuildData = {
  prompt: string;
  words: Array<{ id: string; text: string }>;
  correctOrder: string[];
};

type Props = ExerciseComponentProps<TapToBuildData> & {
  onCheck?: () => void;
  onNext?: () => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toArray(val: string | string[] | null): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TapToBuildExercise({
  data,
  selectedAnswer,
  isLocked,
  onSelect,
  onCheck,
  onNext,
}: Props) {
  const selected = toArray(selectedAnswer);

  // Stable shuffle — re-runs only when word IDs change
  const shuffledRef = useRef<Array<{ id: string; text: string }> | null>(null);
  const prevIdsRef = useRef('');
  const wordIds = data.words.map((w) => w.id).join(',');
  if (wordIds !== prevIdsRef.current || shuffledRef.current === null) {
    shuffledRef.current = shuffle([...data.words]);
    prevIdsRef.current = wordIds;
  }
  const shuffledWords = shuffledRef.current;

  const [announcement, setAnnouncement] = useState('');

  const isComplete = selected.length === data.words.length;
  const isCorrect =
    isComplete && selected.every((id, i) => id === data.correctOrder[i]);

  function handleWordBankTap(wordId: string) {
    if (isLocked || selected.includes(wordId)) return;
    const word = data.words.find((w) => w.id === wordId);
    if (word) setAnnouncement(`Added: ${word.text}`);
    onSelect([...selected, wordId]);
  }

  function handleAnswerTap(wordId: string) {
    if (isLocked) return;
    const word = data.words.find((w) => w.id === wordId);
    if (word) setAnnouncement(`Removed: ${word.text}`);
    onSelect(selected.filter((id) => id !== wordId));
  }

  function getAnswerTileStyle(index: number) {
    if (!isLocked) return styles.tileDefault;
    return selected[index] === data.correctOrder[index]
      ? styles.tileCorrect
      : styles.tileWrong;
  }

  const buttonVariant = isLocked ? (isCorrect ? 'correct' : 'wrong') : 'primary';
  const arrowColor =
    isComplete || isLocked ? Colors.text.negative : Colors.text.disabled;

  return (
    <View style={styles.root}>
      {/* Visually hidden live region — announces word additions/removals to screen readers */}
      <Text style={styles.liveRegion} accessibilityLiveRegion="polite" accessible>
        {announcement}
      </Text>

      {/* Top: prompt + answer area (sentence being built), same styling as original word bank section */}
      <View style={styles.topSection}>
        <Text style={styles.prompt}>{data.prompt}</Text>

        <View>
          <View style={styles.separator} />
          <View style={styles.answerRow}>
            {/* Filled slots: words the user has tapped in order */}
            {selected.map((wordId, index) => {
              const word = data.words.find((w) => w.id === wordId);
              if (!word) return null;
              return (
                <TouchableOpacity
                  key={wordId}
                  onPress={() => handleAnswerTap(wordId)}
                  style={[styles.tile, getAnswerTileStyle(index)]}
                  disabled={isLocked}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={word.text}
                  accessibilityState={{ disabled: isLocked }}
                >
                  <Text style={isLocked ? styles.tileTextNegative : styles.tileText}>
                    {word.text}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Placeholder slots for remaining words */}
            {Array.from({ length: data.words.length - selected.length }).map((_, i) => (
              <View key={`slot-${i}`} style={[styles.tile, styles.tilePlaceholder]} />
            ))}
          </View>
          <View style={styles.separator} />
        </View>
      </View>

      {/* Bottom: white card with shuffled word bank + check/next button */}
      <View style={styles.bottomCard}>
        <View style={styles.wordBankRow}>
          {shuffledWords.map((word) => {
            const isGhost = selected.includes(word.id);
            return (
              <TouchableOpacity
                key={word.id}
                onPress={() => handleWordBankTap(word.id)}
                style={[styles.tile, isGhost ? styles.tileGhost : styles.tileDefault]}
                disabled={isLocked || isGhost}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={word.text}
                accessibilityState={{ disabled: isLocked || isGhost }}
              >
                <Text style={[styles.tileText, isGhost && styles.tileTextHidden]}>
                  {word.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          label={isLocked ? 'Next' : 'Check'}
          variant={buttonVariant}
          disabled={!isComplete && !isLocked}
          onPress={isLocked ? onNext : onCheck}
          rightIcon={<Icon name="arrow_forward" size={24} color={arrowColor} />}
        />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface.default,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    justifyContent: 'space-between',
  },
  topSection: {
    gap: Spacing.md,
  },
  prompt: {
    ...Typography.english.title.l,
    color: Colors.text.title,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.default,
  },
  answerRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  bottomCard: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 16,
    padding: 20,
    gap: 24,
  },
  wordBankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  tile: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tileDefault: {
    backgroundColor: Colors.surface.subtle,
    borderColor: Colors.border.default,
  },
  tileGhost: {
    backgroundColor: Colors.surface.disabled,
    borderColor: Colors.border.disabled,
  },
  tilePlaceholder: {
    backgroundColor: Colors.surface.disabled,
    borderColor: Colors.border.disabled,
    minWidth: 64,
  },
  tileCorrect: {
    backgroundColor: Colors.success.surface,
    borderColor: Colors.success.border,
  },
  tileWrong: {
    backgroundColor: Colors.error.surface,
    borderColor: Colors.error.border,
  },
  tileText: {
    ...Typography.arabic.title.m,
    color: Colors.text.title,
  },
  tileTextNegative: {
    ...Typography.arabic.title.m,
    color: Colors.text.negative,
  },
  tileTextHidden: {
    opacity: 0,
  },
  liveRegion: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    opacity: 0,
  },
});
