import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon, IconName } from '@/components/atoms/Icon';
import ProgressBar from '@/components/atoms/ProgressBar';

type HeaderActivityProps = {
  progress: number;
  currentStep?: number;
  totalSteps?: number;
  showStepper?: boolean;
  rightIconName?: IconName;
  rightIconColor?: string;
  onClose: () => void;
  onRightIconPress?: () => void;
  style?: ViewStyle;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

export default function HeaderActivity({
  progress,
  currentStep,
  totalSteps,
  showStepper = true,
  rightIconName = 'translate',
  rightIconColor = Colors.icon.default,
  onClose,
  onRightIconPress,
  style,
}: HeaderActivityProps) {
  const hasStepper = showStepper && currentStep !== undefined && totalSteps !== undefined;

  const rightIcon = <Icon name={rightIconName} size={24} color={rightIconColor} />;

  return (
    <View style={[styles.container, style]}>
      {/* Close button */}
      <Pressable
        onPress={onClose}
        hitSlop={HIT_SLOP}
        style={styles.iconContainer}
        accessibilityRole="button"
        accessibilityLabel="Close lesson"
      >
        <Icon name="close" size={24} color={Colors.icon.default} />
      </Pressable>

      {/* Progress bar */}
      <ProgressBar progress={progress} style={styles.progressBar} />

      {/* Step counter */}
      {hasStepper && (
        <Text style={styles.stepper} numberOfLines={1}>
          {currentStep}/{totalSteps}
        </Text>
      )}

      {/* Right icon */}
      {onRightIconPress ? (
        <Pressable
          onPress={onRightIconPress}
          hitSlop={HIT_SLOP}
          style={styles.iconContainer}
          accessibilityRole="button"
        >
          {rightIcon}
        </Pressable>
      ) : (
        <View style={styles.iconContainer}>{rightIcon}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  iconContainer: {
    padding: 10,
  },
  progressBar: {
    flex: 1,
  },
  stepper: {
    ...Typography.english.title.s,
    color: Colors.text.caption,
    textAlign: 'center',
  },
});
