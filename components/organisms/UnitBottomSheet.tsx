import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import UnitNode from '@/components/molecules/UnitNode';
import type { Lesson } from '@/types/content';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UnitBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  lessons: Lesson[];
  onLessonPress: (lessonId: string) => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SHEET_BORDER_RADIUS = 24;
const HANDLE_WIDTH = 40;
const HANDLE_HEIGHT = 4;
const DRAG_DISMISS_THRESHOLD = 80;
const SHEET_OFF_SCREEN = 600;
// Divider centered under circle: UnitNode paddingLeft(16) + radius(40) − half-line(0.5) ≈ 55
const DIVIDER_OFFSET = 55;

// ─── Component ────────────────────────────────────────────────────────────────

export default function UnitBottomSheet({
  isVisible,
  onClose,
  lessons,
  onLessonPress,
}: UnitBottomSheetProps) {
  // Keep the Modal mounted during the exit animation
  const [modalVisible, setModalVisible] = useState(false);

  // slideAnim drives the sheet position for all cases: enter, drag, exit
  const slideAnim = useRef(new Animated.Value(SHEET_OFF_SCREEN)).current;
  // fadeAnim drives the backdrop opacity independently
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          bounciness: 0,
          speed: 14,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SHEET_OFF_SCREEN,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
        slideAnim.setValue(SHEET_OFF_SCREEN); // reset for next open
      });
    }
  }, [isVisible]);

  // PanResponder lives on the handle — ScrollView scrolls freely
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 5,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) slideAnim.setValue(dy);
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy > DRAG_DISMISS_THRESHOLD) {
          // Exit animation starts from current drag position → looks natural
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {/* Backdrop fades independently */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Sheet slides independently */}
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Drag handle */}
          <View style={styles.handleWrapper} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

          {/* Lesson list */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            bounces={false}
          >
            {lessons.map((lesson, index) => (
              <React.Fragment key={lesson.id}>
                {index > 0 && <View style={styles.divider} />}
                <UnitNode
                  variant={index === 0 ? 'open' : 'locked'}
                  type="unit"
                  title={lesson.title.en}
                  onPress={
                    index === 0
                      ? () => {
                          onClose();
                          onLessonPress(lesson.id);
                        }
                      : undefined
                  }
                />
              </React.Fragment>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.surface.default,
    borderTopLeftRadius: SHEET_BORDER_RADIUS,
    borderTopRightRadius: SHEET_BORDER_RADIUS,
    maxHeight: '80%',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  handleWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: Math.round(HANDLE_HEIGHT / 2),
    backgroundColor: Colors.border.default,
  },
  listContent: {
    paddingBottom: Spacing.sm,
  },
  divider: {
    height: 20,
    marginLeft: DIVIDER_OFFSET,
    width: 1,
    backgroundColor: Colors.border.default,
  },
});
