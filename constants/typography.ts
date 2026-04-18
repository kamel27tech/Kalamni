// constants/typography.ts
// Typography tokens exported from Figma — TMA Design System
// Font: IBM Plex Sans Arabic (supports both English and Arabic)

import { TextStyle } from 'react-native';

// ============================================
// FONT FAMILY CONSTANTS
// These names must match exactly how you load the fonts in _layout.tsx
// ============================================

const FONT = {
  regular: 'IBMPlexSansArabic-Regular',    // 400
  medium: 'IBMPlexSansArabic-Medium',      // 500
  semiBold: 'IBMPlexSansArabic-SemiBold',  // 600
  bold: 'IBMPlexSansArabic-Bold',          // 700
} as const;

// ============================================
// TYPOGRAPHY TOKENS
// Use these directly in your components as style objects
// ============================================

export const Typography = {
  english: {
    heading: {
      h1: {
        fontFamily: FONT.bold,
        fontSize: 32,
        lineHeight: 44.8,
        letterSpacing: 0,
      } as TextStyle,
      h2: {
        fontFamily: FONT.bold,
        fontSize: 24,
        lineHeight: 33.6,
        letterSpacing: 0,
      } as TextStyle,
      h3: {
        fontFamily: FONT.bold,
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0,
      } as TextStyle,
    },
    title: {
      l: {
        fontFamily: FONT.semiBold,
        fontSize: 18,
        lineHeight: 25.2,
        letterSpacing: 0,
      } as TextStyle,
      m: {
        fontFamily: FONT.semiBold,
        fontSize: 16,
        lineHeight: 22.4,
        letterSpacing: 0,
      } as TextStyle,
      s: {
        fontFamily: FONT.semiBold,
        fontSize: 14,
        lineHeight: 19.6,
        letterSpacing: 0,
      } as TextStyle,
    },
    body: {
      l: {
        fontFamily: FONT.regular,
        fontSize: 16,
        lineHeight: 25.6,
        letterSpacing: 0,
      } as TextStyle,
      m: {
        fontFamily: FONT.regular,
        fontSize: 14,
        lineHeight: 21,
        letterSpacing: 0,
      } as TextStyle,
    },
  },

  arabic: {
    heading: {
      h1: {
        fontFamily: FONT.bold,
        fontSize: 28,
        lineHeight: 61.6,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
      h2: {
        fontFamily: FONT.bold,
        fontSize: 24,
        lineHeight: 52.8,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
    },
    title: {
      l: {
        fontFamily: FONT.semiBold,
        fontSize: 20,
        lineHeight: 42,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
      m: {
        fontFamily: FONT.semiBold,
        fontSize: 18,
        lineHeight: 36,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
    },
    body: {
      lBold: {
        fontFamily: FONT.bold,
        fontSize: 16,
        lineHeight: 32,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
      lMedium: {
        fontFamily: FONT.medium,
        fontSize: 16,
        lineHeight: 32,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
      lRegular: {
        fontFamily: FONT.regular,
        fontSize: 16,
        lineHeight: 35.2,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
      mSemi: {
        fontFamily: FONT.semiBold,
        fontSize: 14,
        lineHeight: 28,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
      mRegular: {
        fontFamily: FONT.regular,
        fontSize: 14,
        lineHeight: 30.8,
        letterSpacing: 0,
        writingDirection: 'rtl',
      } as TextStyle,
    },
  },
} as const;

// Also export FONT constants in case you need them for custom styles
export { FONT };