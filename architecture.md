# Component Architecture

Components follow a layered hierarchy. Each layer may only import from layers below it.

## Layers

### atoms — `components/atoms/`
Primitive, single-responsibility UI elements with no internal state.
Examples: `Icon`, `ProgressBar`

### molecules — `components/molecules/`
Composed of atoms. Own their own layout and visual state but no feature logic.
Examples: `UnitNode`, `LevelBanner`, `SectionHeader`

### organisms — `components/organisms/`
Composed of multiple molecules (and atoms). Own feature-level behavior and may hold local UI state. They are self-contained feature units — not reusable in arbitrary contexts.
Examples: `UnitBottomSheet` (renders a lesson list inside a modal bottom sheet, wired to navigation)

### screens — `app/`
Expo Router file-based screens. Compose organisms and molecules. Own data-fetching, route params, and navigation logic.
Examples: `app/(tabs)/index.tsx`, `app/lesson/[id].tsx`

## Rules

- Import direction is strictly downward: screens → organisms → molecules → atoms.
- Organisms may hold local state (`useState`, `useRef`, `PanResponder`) but must not fetch data — they receive everything via props.
- No inline style values — use tokens from `constants/colors`, `constants/typography`, `constants/spacing`.
- Wrap computed layout values in `Math.round()`.
