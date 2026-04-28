import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/atoms/Icon';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnswerState = 'default' | 'selected' | 'correct' | 'wrong';

// Discriminated union: either text or image must be provided, never both.
type TextOption = {
  text: string;
  transliteration?: string;
  image?: never;
  imageAlt?: never;
};

type ImageOption = {
  image: ImageSourcePropType;
  imageAlt?: string;
  text?: never;
  transliteration?: never;
};

type AnswerOptionProps = (TextOption | ImageOption) & {
  state?: AnswerState;
  onPress: () => void;
  disabled?: boolean;
  isGrouped?: boolean;
  style?: ViewStyle;
};

// ─── State helpers ────────────────────────────────────────────────────────────

function isChecked(state: AnswerState): boolean {
  return state === 'selected' || state === 'correct';
}

function borderColor(state: AnswerState): string {
  if (isChecked(state)) return Colors.success.border;
  if (state === 'wrong') return Colors.error.border;
  return Colors.border.default;
}

function borderWidth(state: AnswerState): number {
  return state === 'default' ? 1.5 : 2;
}

function accessibilityLabel(state: AnswerState, content: string): string {
  if (isChecked(state)) return `Selected option: ${content}`;
  if (state === 'wrong') return `Wrong answer: ${content}`;
  return `Option: ${content}`;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ state }: { state: AnswerState }) {
  if (state === 'default') return null;
  const checked = isChecked(state);
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: checked ? Colors.success.surface : Colors.error.surface },
      ]}
    >
      <Icon name={checked ? 'check' : 'close'} size={14} color={Colors.text.negative} />
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnswerOption({
  state = 'default',
  onPress,
  disabled = false,
  isGrouped = false,
  style,
  text,
  transliteration,
  image,
  imageAlt,
}: AnswerOptionProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }

  const isImage = image != null;
  const contentLabel = text ?? imageAlt ?? 'image option';

  return (
    <Animated.View
      style={[
        { transform: [{ scale }] },
        disabled && styles.disabledWrapper,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel(state, contentLabel)}
        accessibilityState={{ disabled, selected: isChecked(state) }}
        style={[
          styles.container,
          !isGrouped && styles.standaloneCard,
          isImage ? styles.imageContainer : styles.textContainer,
          { borderColor: borderColor(state), borderWidth: borderWidth(state) },
        ]}
      >
        {isImage ? (
          <Image
            source={image}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
            accessibilityLabel={imageAlt}
          />
        ) : (
          <View style={styles.textContent}>
            <Text style={styles.arabicText}>{text}</Text>
            {transliteration ? (
              <Text style={styles.transliteration}>{transliteration}</Text>
            ) : null}
          </View>
        )}

        <StatusBadge state={state} />
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  standaloneCard: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 12,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  textContent: {
    flex: 1,
  },
  arabicText: {
    ...Typography.arabic.title.m,
    color: Colors.text.title,
    textAlign: 'right',
  },
  transliteration: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
    textAlign: 'right',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: 11,
    left: 11,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
