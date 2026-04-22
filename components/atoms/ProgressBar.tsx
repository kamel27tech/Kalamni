import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

type ProgressBarProps = {
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  animated?: boolean;
  style?: ViewStyle;
};

export default function ProgressBar({
  progress,
  height = 6,
  trackColor = Colors.surface.disabled,
  fillColor = Colors.secondary.surface,
  animated = true,
  style,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const animatedProgress = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: clamped,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      animatedProgress.setValue(clamped);
    }
  }, [clamped, animated]);

  const widthPercent = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        {
          height,
          borderRadius: Math.round(height / 2),
          backgroundColor: trackColor,
          overflow: 'hidden',
          width: '100%',
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height,
          borderRadius: Math.round(height / 2),
          backgroundColor: fillColor,
          width: widthPercent,
        }}
      />
    </View>
  );
}
