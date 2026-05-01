import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Primitives } from '@/constants/colors';
import { FONT, Typography } from '@/constants/typography';
import { Icon } from '@/components/atoms/Icon';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UnitNodeVariant = 'open' | 'completed' | 'not_completed' | 'locked' | 'plus';
export type UnitNodeType = 'unit' | 'checkpoint';

export type UnitNodeProps = {
  variant: UnitNodeVariant;
  type: UnitNodeType;
  title: string;
  subtitle?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const OUTER = 80;
const INNER = 64;
const BORDER_W = 5;

// ─── Per-variant style helpers ────────────────────────────────────────────────

function getOuterBorderColor(variant: UnitNodeVariant): string {
  switch (variant) {
    case 'locked':       return Colors.border.disabled;        // #e6e6e6
    case 'plus':         return Primitives.secondary[100];     // #fff3dc
    case 'completed':    return Colors.success.border;
    case 'not_completed': return Primitives.success[200];
    default:             return Colors.border.default;         // #ededed
  }
}

function getInnerBg(variant: UnitNodeVariant, type: UnitNodeType): string | undefined {
  if (type === 'checkpoint') {
    if (variant === 'locked') return Colors.surface.disabled;
    if (variant === 'completed') return Colors.success.surfaceSubtle;
    return Primitives.secondary[200]; // open / not_completed / plus → amber #ffe9bd
  }
  if (variant === 'plus') return Primitives.secondary[200];
  return undefined;
}

function getCheckpointIconColor(variant: UnitNodeVariant): string {
  if (variant === 'locked') return Colors.icon.disabled;
  if (variant === 'completed') return Colors.success.text;
  return Colors.secondary.surface;
}

function getTitleColor(variant: UnitNodeVariant): string {
  if (variant === 'locked') return Colors.text.caption;
  if (variant === 'plus') return Colors.text.body;
  return Colors.text.title;
}

// ─── Circle avatar ────────────────────────────────────────────────────────────

function CircleAvatar({
  variant,
  type,
  imageSource,
}: Pick<UnitNodeProps, 'variant' | 'type' | 'imageSource'>) {
  const isCheckpoint = type === 'checkpoint';
  const isLocked = variant === 'locked';
  const isPlus = variant === 'plus';

  const iconName: string | null = isCheckpoint
    ? isLocked ? 'lock' : isPlus ? 'workspace_premium' : 'flag'
    : isLocked ? 'lock' : isPlus ? 'workspace_premium' : null;

  const iconColor = isCheckpoint
    ? getCheckpointIconColor(variant)
    : isLocked ? Colors.icon.disabled : Colors.secondary.surface;

  const innerBg = getInnerBg(variant, type);

  return (
    <View style={[styles.outerCircle, { borderColor: getOuterBorderColor(variant) }]}>
      <View style={[styles.innerCircle, innerBg != null ? { backgroundColor: innerBg } : undefined]}>
        {!isCheckpoint && imageSource != null && (
          <Image
            source={imageSource}
            style={[StyleSheet.absoluteFillObject, (isLocked || isPlus) && { opacity: 0.5 }]}
            resizeMode="cover"
            accessibilityElementsHidden
          />
        )}
        {iconName != null && (
          <Icon name={iconName} size={28} color={iconColor} />
        )}
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UnitNode({
  variant,
  type,
  title,
  subtitle,
  imageSource,
  onPress,
}: UnitNodeProps) {
  const isPlus = variant === 'plus';
  const isLocked = variant === 'locked';

  const content = (
    <>
      <CircleAvatar variant={variant} type={type} imageSource={imageSource} />
      <View style={styles.textCol}>
        <Text
          style={[styles.title, { color: getTitleColor(variant) }]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {type === 'checkpoint' && subtitle != null ? (
          <Text style={[styles.subtitle, { color: isLocked ? Colors.text.caption : Colors.text.body }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {isPlus && (
        <View style={styles.plusBadge}>
          <Text style={styles.plusBadgeText}>PLUS</Text>
        </View>
      )}
    </>
  );

  if (isLocked) {
    return (
      <View style={styles.row} accessibilityState={{ disabled: true }}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      style={isPlus ? styles.plusCard : styles.row}
      onPress={onPress}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 24,
    gap: 12,
    borderRadius: 12,
  },
  plusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 24,
    gap: 12,
    backgroundColor: Colors.surface.subtle, // white — Figma: grayscale/surface/subtle
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  outerCircle: {
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    borderWidth: BORDER_W,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  innerCircle: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  title: {
    ...Typography.english.title.l,
  },
  subtitle: {
    ...Typography.english.body.m,
  },
  plusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.secondary.surface,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBadgeText: {
    fontFamily: FONT.semiBold,
    fontSize: 14,
    lineHeight: 19.6,
    color: Colors.text.negative,
  },
});
