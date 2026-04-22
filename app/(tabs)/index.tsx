import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/atoms/Button';
import { Spacing } from '../../constants/spacing';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { getAllLevels } from '../../lib/content';

function getFirstLessonId(): string {
  for (const level of getAllLevels()) {
    for (const topic of level.topics) {
      for (const unit of topic.units) {
        if (unit.lessons.length > 0) return unit.lessons[0].id;
      }
    }
  }
  console.warn('[DevMenu] No lessons found in course data — navigating to test ID for "not found" state.');
  return 'lesson-test-001';
}

export default function DevMenu() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Kalimni — Dev Menu</Text>
        <View style={styles.buttons}>
          <Button
            label="Design System Showcase"
            variant="primary"
            onPress={() => router.push('/showcase')}
          />
          <Button
            label="Content Test Screen"
            variant="primary"
            onPress={() => router.push('/content-test')}
          />
          <Button
            label="Test Lesson Player"
            variant="primary"
            onPress={() => router.push(`/lesson/${getFirstLessonId()}`)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface.subtle,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  title: {
    ...Typography.english.title.l,
    color: Colors.text.title,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    gap: Spacing.md,
  },
});
