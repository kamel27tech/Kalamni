import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type PromptCardProps = {
  text: string;
  style?: ViewStyle;
};

export default function PromptCard({ text, style }: PromptCardProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  text: {
    ...Typography.arabic.title.m,
    color: Colors.text.heading,
    textAlign: 'right',
  },
});
