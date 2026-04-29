import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ExerciseComponentProps } from '@/types/exercises';
import AnswerOption, { AnswerState } from '@/components/molecules/AnswerOption';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export type MatchingPairsData = {
  prompt: string;
  pairs: Array<{ id: string; left: string; right: string }>;
};

type Props = ExerciseComponentProps<MatchingPairsData> & {
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

function parseMatchedIds(selectedAnswer: string | string[] | null): Set<string> {
  if (!selectedAnswer) return new Set();
  const arr = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
  const ids = new Set<string>();
  for (const entry of arr) {
    const leftId = entry.split(',')[0];
    if (leftId) ids.add(leftId);
  }
  return ids;
}

function toArray(selectedAnswer: string | string[] | null): string[] {
  if (!selectedAnswer) return [];
  return Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MatchingPairsExercise({
  data,
  selectedAnswer,
  isLocked,
  onSelect,
  onNext,
}: Props) {
  // Stable shuffle — re-runs only when pair IDs change
  const shuffledRightRef = useRef<Array<{ id: string; text: string }> | null>(null);
  const prevPairIdsRef = useRef('');
  const pairIds = data.pairs.map((p) => p.id).join(',');
  if (pairIds !== prevPairIdsRef.current || shuffledRightRef.current === null) {
    shuffledRightRef.current = shuffle(data.pairs.map((p) => ({ id: p.id, text: p.right })));
    prevPairIdsRef.current = pairIds;
  }
  const shuffledRight = shuffledRightRef.current;

  const matchedIds = parseMatchedIds(selectedAnswer);
  const allMatched = data.pairs.length > 0 && matchedIds.size === data.pairs.length;

  const [pendingLeftId, setPendingLeftId] = useState<string | null>(null);
  const [errorIds, setErrorIds] = useState<{ left: string; right: string } | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (errorTimer.current) clearTimeout(errorTimer.current); }, []);
  useEffect(() => { if (isLocked) setPendingLeftId(null); }, [isLocked]);

  function handleLeftPress(id: string) {
    if (isLocked || matchedIds.has(id)) return;
    setErrorIds(null);
    setPendingLeftId((prev) => (prev === id ? null : id));
  }

  function handleRightPress(rightId: string) {
    if (isLocked || matchedIds.has(rightId) || !pendingLeftId) return;

    if (pendingLeftId === rightId) {
      const pair = data.pairs.find((p) => p.id === rightId);
      const newMatched = [...toArray(selectedAnswer), `${pendingLeftId},${rightId}`];
      setPendingLeftId(null);
      setErrorIds(null);
      if (pair) setLiveAnnouncement(`Matched: ${pair.left} — ${pair.right}`);
      onSelect(newMatched);
    } else {
      setErrorIds({ left: pendingLeftId, right: rightId });
      if (errorTimer.current) clearTimeout(errorTimer.current);
      errorTimer.current = setTimeout(() => {
        setErrorIds(null);
        setPendingLeftId(null);
      }, 500);
    }
  }

  function getLeftState(id: string): AnswerState {
    if (matchedIds.has(id)) return 'correct';
    if (errorIds?.left === id) return 'wrong';
    if (pendingLeftId === id) return 'selected';
    return 'default';
  }

  function getRightState(id: string): AnswerState {
    if (matchedIds.has(id)) return 'correct';
    if (errorIds?.right === id) return 'wrong';
    return 'default';
  }

  const arrowColor = allMatched ? Colors.text.negative : Colors.text.disabled;

  return (
    <View style={styles.root}>
      {/* Top: prompt text */}
      <View style={styles.topSection}>
        <Text style={styles.prompt}>{data.prompt}</Text>
      </View>

      {/* Visually hidden live region — announces matches to screen readers */}
      <Text style={styles.liveRegion} accessibilityLiveRegion="polite" accessible>
        {liveAnnouncement}
      </Text>

      {/* Bottom: white card — 2-col grid + Next button */}
      <View style={styles.bottomCard}>
        <View style={styles.grid}>
          {/* Left column — Arabic words */}
          <View style={styles.column}>
            {data.pairs.map((pair) => (
              <AnswerOption
                key={pair.id}
                text={pair.left}
                state={getLeftState(pair.id)}
                disabled={isLocked}
                onPress={() => handleLeftPress(pair.id)}
              />
            ))}
          </View>

          {/* Right column — English translations, shuffled */}
          <View style={styles.column}>
            {shuffledRight.map(({ id, text }) => (
              <AnswerOption
                key={id}
                text={text}
                state={getRightState(id)}
                disabled={isLocked}
                onPress={() => handleRightPress(id)}
              />
            ))}
          </View>
        </View>

        <Button
          label="Next"
          variant={allMatched ? 'correct' : 'primary'}
          disabled={!allMatched}
          onPress={onNext}
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
  liveRegion: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    opacity: 0,
  },
  bottomCard: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 16,
    padding: 20,
    gap: 24,
  },
  grid: {
    flexDirection: 'row',
    gap: 24,
  },
  column: {
    flex: 1,
    gap: 12,
  },
});
