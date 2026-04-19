import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'correct' | 'wrong';
export type ButtonSize = 'L' | 'M' | 'S';

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

type VariantTokens = {
  background: string;
  backgroundPressed: string;
  textColor: string;
  iconColor: string;
};

const variantTokens: Record<ButtonVariant, VariantTokens> = {
  primary: {
    background: Colors.primary.surface,
    backgroundPressed: Colors.primary.surfaceHover,
    textColor: Colors.text.negative,
    iconColor: Colors.icon.negative,
  },
  correct: {
    background: Colors.success.surface,
    backgroundPressed: Colors.success.surfaceHover,
    textColor: Colors.text.negative,
    iconColor: Colors.icon.negative,
  },
  wrong: {
    background: Colors.error.surface,
    backgroundPressed: Colors.error.surfaceHover,
    textColor: Colors.text.negative,
    iconColor: Colors.icon.negative,
  },
  secondary: {
    background: 'transparent',
    backgroundPressed: Colors.surface.default,
    textColor: Colors.text.title,
    iconColor: Colors.icon.default,
  },
  tertiary: {
    background: Colors.surface.default,
    backgroundPressed: Colors.surface.lighter,
    textColor: Colors.text.title,
    iconColor: Colors.icon.default,
  },
};

const sizeStyles: Record<ButtonSize, { height: number; paddingHorizontal: number; minWidth?: number }> = {
  L: { height: 64, paddingHorizontal: 24 },
  M: { height: 56, paddingHorizontal: 24 },
  S: { height: 48, paddingHorizontal: 16, minWidth: 160 },
};

export default function Button({
  label,
  variant = 'primary',
  size = 'L',
  disabled = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
}: ButtonProps) {
  const tokens = variantTokens[variant];
  const sizing = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: sizing.height,
          paddingHorizontal: sizing.paddingHorizontal,
          minWidth: sizing.minWidth,
          backgroundColor: disabled
            ? Colors.surface.disabled
            : pressed
            ? tokens.backgroundPressed
            : tokens.background,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {leftIcon && (
        <View style={styles.icon}>
          {leftIcon}
        </View>
      )}

      <Text
        style={[
          size === 'S' ? styles.labelS : styles.label,
          {
            color: disabled ? Colors.text.disabled : tokens.textColor,
            flexShrink: size === 'S' ? 1 : 0,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {rightIcon && (
        <View style={styles.icon}>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 20,
    overflow: 'hidden',
  },
  label: {
    ...Typography.english.title.l,
    textAlign: 'center',
  },
  labelS: {
    ...Typography.english.title.m,
    textAlign: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
