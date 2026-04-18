// constants/colors.ts
// Color tokens exported from Figma — TMA Design System
// Two-layer structure: Primitives (raw values) + Semantic (usage-based)

// ============================================
// LAYER 1: PRIMITIVES (raw color scales)
// Never use these directly in components — use semantic tokens below
// ============================================

const Primitives = {
  grayScale: {
    50: '#ffffff',
    100: '#fdfdfd',
    200: '#f8f8f8',
    300: '#ededed',
    400: '#e6e6e6',
    500: '#b1b1b1',
    600: '#888888',
    700: '#666666',
    800: '#444444',
    900: '#222222',
    950: '#000000',
  },
  primary: {
    50: '#fdefed',
    100: '#fadad6',
    200: '#f6bab2',
    300: '#f19589',
    400: '#ec7060',
    500: '#e74c39', // base
    600: '#cd2e19',
    700: '#9b2313',
    800: '#69170d',
    900: '#320b06',
    950: '#1b0603',
  },
  secondary: {
    50: '#fffaf0',
    100: '#fff3dc',
    200: '#ffe9bd',
    300: '#ffdd99',
    400: '#ffd37a',
    500: '#ffc658', // base
    600: '#ffb112',
    700: '#cc8801',
    800: '#8a5c01',
    900: '#422c00',
    950: '#241700',
  },
  brown: {
    50: '#f4e0e3',
    100: '#ecc5cb',
    200: '#da8694',
    300: '#c74c60',
    400: '#952d3f',
    500: '#581b25',
    600: '#46161e',
    700: '#371118',
    800: '#230b0f',
    900: '#140608',
    950: '#080203',
  },
  success: {
    50: '#e5fae8',
    100: '#cff6d4',
    200: '#9ceda4',
    300: '#6de47a',
    400: '#3ddc50',
    500: '#22bb33',
    600: '#1c972a',
    700: '#14701f',
    800: '#0d4913',
    900: '#07270b',
    950: '#031105',
  },
  error: {
    50: '#f9e5e5',
    100: '#f8ced0',
    200: '#ed9b9d',
    300: '#e56c6e',
    400: '#dc3739',
    500: '#bb2124',
    600: '#93191c',
    700: '#721415',
    800: '#4b0d0e',
    900: '#270707',
    950: '#110403',
  },
  warning: {
    50: '#fff3eb',
    100: '#feeadb',
    200: '#ffd2b3',
    300: '#ffbe8f',
    400: '#ffa666',
    500: '#ff9242',
    600: '#ff6a00',
    700: '#c25100',
    800: '#803400',
    900: '#421c00',
    950: '#1f0d00',
  },
  info: {
    50: '#def5fc',
    100: '#bdeaf9',
    200: '#78d4f2',
    300: '#36bfed',
    400: '#119bc9',
    500: '#0d6786',
    600: '#09536c',
    700: '#083d50',
    800: '#062833',
    900: '#03161c',
    950: '#010b0e',
  },
  dataViz: {
    orange: '#d5a184',
    darkBlue: '#3a455a',
    blue: '#0c6786',
    // add green when you confirm its value
  },
} as const;

// ============================================
// LAYER 2: SEMANTIC TOKENS (what your components use)
// These reference primitives. Always use THESE in your components.
// ============================================

export const Colors = {
  // Neutral surfaces (backgrounds)
  surface: {
    subtle: Primitives.grayScale[50],    // #ffffff
    lighter: Primitives.grayScale[300],  // #ededed
    default: Primitives.grayScale[200],  // #f8f8f8
    disabled: Primitives.grayScale[400], // #e6e6e6
  },

  // Borders
  border: {
    subtle: Primitives.grayScale[200],
    default: Primitives.grayScale[300],
    darker: Primitives.grayScale[500],
    strong: Primitives.grayScale[800],
    disabled: Primitives.grayScale[400],
    negative: Primitives.grayScale[50], // for use on dark backgrounds
  },

  // Text
  text: {
    heading: Primitives.grayScale[950],   // #000000
    title: Primitives.grayScale[900],     // #222222
    body: Primitives.grayScale[800],      // #444444
    caption: Primitives.grayScale[600],   // #888888
    disabled: Primitives.grayScale[500],
    negative: Primitives.grayScale[50],   // white, for dark backgrounds
  },

  // Icons
  icon: {
    default: Primitives.grayScale[900],
    darker: Primitives.grayScale[950],
    subtle: Primitives.grayScale[800],
    disabled: Primitives.grayScale[500],
    negative: Primitives.grayScale[50],
  },

  // Brand — primary (coral red)
  primary: {
    surface: Primitives.primary[500],
    surfaceHover: Primitives.primary[600],
    surfaceSubtle: Primitives.primary[50],
    text: Primitives.primary[500],
    border: Primitives.primary[500],
  },

  // Brand — secondary (warm yellow)
  secondary: {
    surface: Primitives.secondary[500],
    surfaceHover: Primitives.secondary[600],
    surfaceSubtle: Primitives.secondary[50],
    text: Primitives.secondary[500],
    border: Primitives.secondary[500],
  },

  // Feedback — success (correct answer, completed lesson)
  success: {
    surface: Primitives.success[500],
    surfaceHover: Primitives.success[600],
    surfaceSubtle: Primitives.success[50],
    text: Primitives.success[500],
    border: Primitives.success[500],
  },

  // Feedback — error (wrong answer)
  error: {
    surface: Primitives.error[500],
    surfaceHover: Primitives.error[600],
    surfaceSubtle: Primitives.error[50],
    text: Primitives.error[500],
    border: Primitives.error[500],
  },

  // Feedback — warning
  warning: {
    surface: Primitives.warning[500],
    surfaceHover: Primitives.warning[600],
    surfaceSubtle: Primitives.warning[50],
    text: Primitives.warning[500],
    border: Primitives.warning[500],
  },

  // Feedback — info (tips, hints)
  info: {
    surface: Primitives.info[500],
    surfaceHover: Primitives.info[700],
    surfaceSubtle: Primitives.info[50],
    text: Primitives.info[500],
    border: Primitives.info[500],
  },

  // Data visualization (charts, progress)
  dataViz: Primitives.dataViz,
} as const;

// Export raw primitives too, in case you need them for edge cases
export { Primitives };