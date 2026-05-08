import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Primitives } from '@/constants/colors';
import { FONT, Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
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
  /** 0.0 → 1.0 — visible only when variant === 'not_completed'. Defaults to 0.25 (matches Figma). */
  progress?: number;
};

// ─── Sizing constants (Figma node 8578:4990) ──────────────────────────────────

const OUTER = 80;
const INNER = 64;
const BORDER_W = 5;
// Round halves so an odd OUTER/INNER still produces a true circle.
const OUTER_RADIUS = Math.round(OUTER / 2);
const INNER_RADIUS = Math.round(INNER / 2);

// SVG arc geometry — stroke is centered on this radius so its outer edge
// lands exactly at the View's outer radius (no clipping by overflow:hidden).
const ARC_CENTER = OUTER / 2;
const ARC_RADIUS = (OUTER - BORDER_W) / 2;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

const ICON_LG = Math.round(40); // lock + crown
const ICON_MD = Math.round(32); // flag

const ROW_PAD_V = Math.round(12);
const ROW_GAP = Math.round(12);
const ROW_RADIUS = Math.round(12);

const PLUS_BADGE_HEIGHT = Math.round(24);
const PLUS_BADGE_PAD_H = Math.round(12);
const PLUS_BADGE_RADIUS_BL = Math.round(12);
const PLUS_BADGE_RADIUS_TR = Math.round(4);
const PLUS_BADGE_FONT_SIZE = 14;
const PLUS_BADGE_LINE_HEIGHT = Math.round(PLUS_BADGE_FONT_SIZE * 1.4);

const PLUS_CARD_SHADOW_RADIUS = Math.round(4);

const DEFAULT_PROGRESS = 0.25;

// ─── Style selectors (variant → StyleSheet entry) ─────────────────────────────

function outerBorderStyle(variant: UnitNodeVariant, type: UnitNodeType) {
  // not_completed Unit: ring is painted by SVG, so View has no border.
  if (variant === 'not_completed' && type === 'unit') return styles.borderNone;
  switch (variant) {
    case 'locked':        return styles.borderLocked;
    case 'plus':          return styles.borderPlus;
    case 'completed':     return styles.borderSuccess;
    case 'not_completed': return styles.borderDefault;
    default:              return styles.borderDefault;
  }
}

function innerBgStyle(variant: UnitNodeVariant, type: UnitNodeType) {
  if (type === 'checkpoint') {
    if (variant === 'locked')    return styles.bgDisabled;
    if (variant === 'completed') return styles.bgSuccessSubtle;
    return styles.bgSecondary; // open / not_completed / plus → amber
  }
  if (variant === 'plus') return styles.bgSecondary;
  return undefined;
}

function titleStyle(variant: UnitNodeVariant) {
  if (variant === 'locked') return styles.titleLocked;
  if (variant === 'plus')   return styles.titlePlus;
  return styles.titleDefault;
}

function subtitleStyle(variant: UnitNodeVariant) {
  if (variant === 'locked') return styles.subtitleLocked;
  return styles.subtitleDefault;
}

function checkpointIconColor(variant: UnitNodeVariant): string {
  if (variant === 'locked')    return Colors.icon.disabled;
  if (variant === 'completed') return Colors.success.text;
  return Colors.secondary.surface;
}

function clampProgress(p: number | undefined): number {
  const n = typeof p === 'number' && !Number.isNaN(p) ? p : DEFAULT_PROGRESS;
  if (n <= 0) return 0;
  if (n >= 1) return 1;
  return n;
}

// ─── Progress arc (SVG) ───────────────────────────────────────────────────────

function ProgressArc({ progress }: { progress: number }) {
  const visible = ARC_CIRCUMFERENCE * progress;
  return (
    <Svg
      width={OUTER}
      height={OUTER}
      style={styles.arcSvg}
      pointerEvents="none"
    >
      {/* Gray track — drawn for every not_completed node so the ring is
          visible even when progress is 0. */}
      <Circle
        cx={ARC_CENTER}
        cy={ARC_CENTER}
        r={ARC_RADIUS}
        stroke={Colors.border.default}
        strokeWidth={BORDER_W}
        fill="none"
      />
      {/* Green progress arc — rotated -90° so it starts at 12 o'clock and
          sweeps clockwise. Skipped at 0 to avoid a visible end-cap dot. */}
      {progress > 0 && (
        <Circle
          cx={ARC_CENTER}
          cy={ARC_CENTER}
          r={ARC_RADIUS}
          stroke={Colors.success.surface}
          strokeWidth={BORDER_W}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${visible} ${ARC_CIRCUMFERENCE}`}
          transform={`rotate(-90 ${ARC_CENTER} ${ARC_CENTER})`}
        />
      )}
    </Svg>
  );
}

// ─── Circle avatar ────────────────────────────────────────────────────────────

function CircleAvatar({
  variant,
  type,
  imageSource,
  progress,
}: Pick<UnitNodeProps, 'variant' | 'type' | 'imageSource'> & { progress: number }) {
  const isCheckpoint = type === 'checkpoint';
  const isLocked = variant === 'locked';
  const isPlus = variant === 'plus';
  const showArc = variant === 'not_completed' && !isCheckpoint;

  let iconName: string | null = null;
  let iconSize = ICON_LG;
  if (isLocked) {
    iconName = 'lock';
  } else if (isPlus) {
    iconName = 'workspace_premium';
  } else if (isCheckpoint) {
    iconName = 'flag';
    iconSize = ICON_MD;
  }

  const iconColor = isCheckpoint
    ? checkpointIconColor(variant)
    : isLocked
      ? Colors.icon.disabled
      : Colors.secondary.surface;

  // Units use a photo; checkpoints use a solid colored disc.
  const showImage = !isCheckpoint && imageSource != null;

  return (
    <View style={[styles.outerCircle, outerBorderStyle(variant, type)]}>
      {showArc && <ProgressArc progress={progress} />}
      <View style={[styles.innerCircle, innerBgStyle(variant, type)]}>
        {showImage && (
          <Image
            source={imageSource}
            style={[styles.innerImage, (isLocked || isPlus) && styles.innerImageDim]}
            resizeMode="cover"
            accessibilityElementsHidden
          />
        )}
        {iconName != null && <Icon name={iconName} size={iconSize} color={iconColor} />}
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
  progress,
}: UnitNodeProps) {
  const isPlus = variant === 'plus';
  const isLocked = variant === 'locked';
  const clampedProgress = clampProgress(progress);

  const containerStyle = isPlus ? styles.plusCard : styles.row;

  const body = (
    <>
      <CircleAvatar
        variant={variant}
        type={type}
        imageSource={imageSource}
        progress={clampedProgress}
      />
      <View style={styles.textCol}>
        <Text style={[styles.title, titleStyle(variant)]} numberOfLines={2}>
          {title}
        </Text>
        {type === 'checkpoint' && subtitle != null ? (
          <Text style={[styles.subtitle, subtitleStyle(variant)]}>{subtitle}</Text>
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
      <View style={containerStyle} accessibilityState={{ disabled: true }}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: false }}
    >
      {body}
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Containers ──
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ROW_PAD_V,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.lg,
    gap: ROW_GAP,
    borderRadius: ROW_RADIUS,
  },
  plusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ROW_PAD_V,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.lg,
    gap: ROW_GAP,
    backgroundColor: Colors.surface.subtle,
    borderRadius: ROW_RADIUS,
    overflow: 'hidden',
    shadowColor: Primitives.grayScale[950],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: PLUS_CARD_SHADOW_RADIUS,
    elevation: 1,
  },

  // ── Circle ──
  outerCircle: {
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  innerCircle: {
    width: INNER,
    height: INNER,
    borderRadius: INNER_RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  innerImageDim: {
    opacity: 0.5,
  },
  arcSvg: {
    ...StyleSheet.absoluteFillObject,
  },

  // ── Outer border per variant ──
  borderNone:    {},
  borderDefault: { borderWidth: BORDER_W, borderColor: Colors.border.default },
  borderLocked:  { borderWidth: BORDER_W, borderColor: Colors.border.disabled },
  borderPlus:    { borderWidth: BORDER_W, borderColor: Primitives.secondary[100] },
  borderSuccess: { borderWidth: BORDER_W, borderColor: Colors.success.border },

  // ── Inner background per variant/type ──
  bgSecondary:     { backgroundColor: Primitives.secondary[200] },
  bgSuccessSubtle: { backgroundColor: Colors.success.surfaceSubtle },
  bgDisabled:      { backgroundColor: Colors.surface.disabled },

  // ── Text ──
  textCol: {
    flex: 1,
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  title: {
    ...Typography.english.title.l,
  },
  subtitle: {
    ...Typography.english.body.m,
  },
  titleDefault:    { color: Colors.text.title },
  titleLocked:     { color: Colors.text.caption },
  titlePlus:       { color: Colors.text.body },
  subtitleDefault: { color: Colors.text.body },
  subtitleLocked:  { color: Colors.text.caption },

  // ── PLUS badge ──
  plusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: PLUS_BADGE_HEIGHT,
    paddingHorizontal: PLUS_BADGE_PAD_H,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.secondary.surface,
    borderBottomLeftRadius: PLUS_BADGE_RADIUS_BL,
    borderTopRightRadius: PLUS_BADGE_RADIUS_TR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBadgeText: {
    fontFamily: FONT.semiBold,
    fontSize: PLUS_BADGE_FONT_SIZE,
    lineHeight: PLUS_BADGE_LINE_HEIGHT,
    color: Colors.text.negative,
  },
});
