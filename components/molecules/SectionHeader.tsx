import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SectionHeaderProps = {
  title: string;
  completedUnits: number;
  totalUnits: number;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SectionHeader({ title, completedUnits, totalUnits }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{completedUnits}/{totalUnits} Unit Completed</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 4,
  },
  title: {
    // Figma uses --grayscale/text/title (#222), not text/heading (#000)
    ...Typography.english.heading.h2,
    color: Colors.text.title,
  },
  subtitle: {
    // Figma: SemiBold 14px = title.s; Colors.text.subtle doesn't exist → caption is the closest muted token
    ...Typography.english.title.s,
    color: Colors.text.caption,
  },
});
