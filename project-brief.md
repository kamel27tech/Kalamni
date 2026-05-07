# Kalimni — Project Brief

> **Kalimni** (كلمني — "Tell Me") is a gamified Arabic language learning app for iOS and Android, built with Expo and React Native.

---

## 1. Project Overview

| Field | Value |
|---|---|
| **App Name** | Kalimni |
| **Type** | Mobile learning application |
| **Platforms** | iOS, Android, Web |
| **Framework** | Expo (managed) ~54.0.33 |
| **Language** | TypeScript (strict) |
| **Version** | 1.0.0 |
| **Routing** | Expo Router v6 (file-based) |

---

## 2. Goals & Purpose

Kalimni teaches Modern Standard Arabic (MSA) to beginners through short, interactive lessons structured like a course. Each lesson is composed of several exercises of different types. Progress is tracked locally and the UI rewards completion with visual feedback and score tiers.

---

## 3. Tech Stack

### Core
- **React** 19.1.0 + **React Native** 0.81.5
- **Expo** ~54.0.33 with New Architecture enabled
- **Expo Router** ~6.0.23 (file-based navigation, typed routes)
- **TypeScript** ~5.9.2

### Navigation & UI
- `@react-navigation/native` ^7.1.8
- `@react-navigation/bottom-tabs` ^7.4.0
- `react-native-reanimated` ~4.1.1
- `react-native-gesture-handler` ~2.28.0
- `react-native-safe-area-context` ~5.6.0
- `react-native-screens` ~4.16.0

### State Management
- **Zustand** ^5.0.12 — auth store + progress store
- **AsyncStorage** 2.2.0 — local persistence for session tokens and lesson progress

### Backend & Auth
- **Supabase** ^2.105.3 — authentication (email/password), future database
- Project URL: `https://nuqmvurdvqmbmuikohxt.supabase.co`

### Media
- `expo-av` ~16.0.8 — audio playback
- `expo-image` ~3.0.11 — optimised image rendering
- `expo-font` ~14.0.11 — custom font loading
- `expo-haptics` ~15.0.8 — haptic feedback on tab press

### Utilities
- `react-native-url-polyfill` ^3.0.0
- `expo-constants`, `expo-web-browser`, `expo-splash-screen`

---

## 4. Directory Structure

```
arabic-app/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout — auth guard, fonts, splash
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab navigator
│   │   ├── index.tsx             # Home / course dashboard
│   │   └── explore.tsx           # Demo/explore tab
│   ├── lesson/
│   │   ├── [id].tsx              # Lesson player (dynamic route)
│   │   └── summary.tsx           # Lesson completion summary
│   ├── sign-in.tsx               # Sign-in screen
│   ├── sign-up.tsx               # Registration screen
│   ├── modal.tsx                 # Dev modal screen
│   ├── showcase.tsx              # Component showcase
│   └── content-test.tsx          # Content diagnostic
│
├── components/
│   ├── atoms/                    # Stateless UI primitives
│   │   ├── Button.tsx
│   │   ├── Icon.tsx
│   │   ├── InputField.tsx
│   │   └── ProgressBar.tsx
│   ├── molecules/                # Composed atoms with local visual state
│   │   ├── HeaderActivity.tsx
│   │   ├── LevelBanner.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── UnitNode.tsx
│   │   ├── AnswerOption.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── FeedbackContainer.tsx
│   │   └── PromptCard.tsx
│   ├── organisms/                # Feature-level components with behavior
│   │   └── UnitBottomSheet.tsx
│   └── exercises/                # One component per exercise type
│       ├── MultipleChoiceExercise.tsx
│       ├── ListeningExercise.tsx
│       ├── MatchingPairsExercise.tsx
│       └── TapToBuildExercise.tsx
│
├── constants/                    # Design tokens
│   ├── colors.ts                 # Primitive + semantic color system
│   ├── typography.ts             # English + Arabic text styles
│   ├── spacing.ts                # xs–xxl spacing scale
│   └── theme.ts                  # Light / dark theme
│
├── types/
│   ├── auth.ts                   # AuthUser, AuthSession
│   ├── content.ts                # Course, Level, Topic, Unit, Lesson, Exercise
│   └── exercises.ts              # ExerciseComponentProps interface
│
├── lib/
│   ├── content.ts                # 40+ helpers to query course.json
│   ├── progress.ts               # AsyncStorage read/write helpers
│   ├── supabase.ts               # Supabase client (platform-aware config)
│   └── stores/
│       ├── authStore.ts          # Zustand auth store
│       └── progress.ts           # Zustand progress store
│
├── data/
│   ├── course.json               # Full course hierarchy (static content)
│   └── lesson.json               # Individual lesson data
│
├── assets/
│   ├── fonts/                    # IBM Plex Sans Arabic (4 weights) + Material Symbols
│   ├── images/                   # App icon, illustrations
│   └── audio/                    # Bundled audio clips
│
├── hooks/
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
│
├── app.json                      # Expo app config
├── tsconfig.json                 # TypeScript config (strict)
├── eslint.config.js
└── architecture.md               # Component hierarchy rules
```

---

## 5. Application Architecture

### Routing & Navigation

```
Root Layout (_layout.tsx)
├── Auth guard (sign-in / sign-up)      ← Unauthenticated users
└── Tab Navigator (tabs)                ← Authenticated users
    ├── Home Tab (index.tsx)
    └── Explore Tab (explore.tsx)

Lesson flow (outside tabs):
  /lesson/[id]  →  /lesson/summary
```

### Auth Guard Flow

1. App boots → splash screen stays visible
2. Root layout calls `initialize()` (checks Supabase session)
3. Hard 3-second fallback timer ensures the app never freezes
4. Splash hides when fonts + auth check are both done
5. No user → `router.replace('/sign-in')`
6. User exists → render normal tab layout

### State Management

**`useAuthStore`** (Zustand)
```ts
{
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  initialize(): Promise<void>   // check session on boot
  signIn(email, password): Promise<void>
  signUp(email, password): Promise<void>
  signOut(): Promise<void>
}
```

**`useProgressStore`** (Zustand)
```ts
{
  completedLessons: string[]    // array of lesson IDs
  isHydrated: boolean
  hydrate(): Promise<void>      // load from AsyncStorage
  markComplete(lessonId): Promise<void>
  isCompleted(lessonId): boolean
}
```

AsyncStorage key: `kalimni:completed_lessons`

---

## 6. Course Content Structure

All content lives in `data/course.json`. Every text field is bilingual:

```ts
type LocaleString = { en: string; ar: string }
```

Hierarchy:

```
Course
 └─ Level[]           (e.g., "Beginner")
     └─ Topic[]       (e.g., "Greetings")
         └─ Unit[]    (e.g., "Hello & Goodbye")
             └─ Lesson[]   (e.g., "Basic Hellos")
                 └─ Exercise[]  (4 types)
```

### Current Content

- **1 Level** — Beginner
- **1 Topic** — Greetings
- **1 Unit** — Hello & Goodbye
- **3 Lessons** — ~5 exercises each

### Exercise Types

| Type | Mechanic |
|---|---|
| `multiple-choice` | Select correct translation from 3–4 options |
| `listening` | Play audio clip, select matching translation |
| `matching-pairs` | Match Arabic words to English meanings |
| `tap-to-build` | Reconstruct a sentence by tapping words in order |

---

## 7. Design System

### Atomic Design Hierarchy

```
Screens
  └─ Organisms (feature behavior)
      └─ Molecules (local visual state)
          └─ Atoms (stateless primitives)
              └─ Constants (tokens)
```

**Rule**: imports flow strictly downward — atoms never import molecules, molecules never import organisms.

### Colors (`constants/colors.ts`)

Two-layer system:

1. **Primitives** — Raw HSL scale values (e.g., `Primitives.primary[500]`)
2. **Semantic tokens** — Usage-based (e.g., `Colors.text.heading`, `Colors.success.surface`)

Key palette:
- **Primary** (coral red `#e74c39`) — CTAs, answer highlights
- **Secondary** (warm yellow `#ffc658`) — audio player, progress
- **Success** (green `#22bb33`) — correct answers, completions
- **Error** (red `#bb2124`) — wrong answers
- **Gray scale** — 10-step neutral (`#ffffff` → `#000000`)

### Typography (`constants/typography.ts`)

- **Font**: IBM Plex Sans Arabic (Regular 400, Medium 500, SemiBold 600, Bold 700)
- **English styles**: h1–h3, title.l/m/s, body.l/m
- **Arabic styles**: h1–h2, title.l/m, body variants (bold/medium/regular + small)
- **RTL**: All Arabic styles include `writingDirection: 'rtl'`

Icon font: Material Symbols Rounded (variable font, weight 400)

### Spacing (`constants/spacing.ts`)

```ts
xs: 4 | sm: 8 | md: 16 | lg: 24 | xl: 32 | xxl: 48
```

### Style Rules

- No raw pixel values — always use spacing tokens or `Math.round(n)` for computed values
- All styles via `StyleSheet.create()`, never inline objects in JSX
- No hardcoded color strings — always use `Colors.*`

---

## 8. Key Components

### Atoms

| Component | Description |
|---|---|
| `Button` | 5 variants (primary, secondary, tertiary, correct, wrong) × 3 sizes (L, M, S) |
| `Icon` | Material Symbols wrapper, accepts `name`, `size`, `color` |
| `InputField` | TextInput with focus border, optional right icon slot |
| `ProgressBar` | Animated fill bar with configurable color + height |

### Molecules

| Component | Description |
|---|---|
| `UnitNode` | Circular 80dp lesson node — 6 variants (open, completed, not_completed, locked, plus) |
| `AnswerOption` | Pressable answer card — 4 states (default, selected, correct, wrong) |
| `AudioPlayer` | Play/pause + animated waveform visualization |
| `HeaderActivity` | Progress bar + numbered stepper for lesson header |
| `LevelBanner` | Level card with trophy icon + progress indicator |
| `PromptCard` | White rounded question card for exercises |
| `FeedbackContainer` | Correct/wrong message + Next button |

### Organisms

| Component | Description |
|---|---|
| `UnitBottomSheet` | Draggable modal with PanResponder — lists lessons for a unit, handles open/close animation |

---

## 9. Lesson Player Flow

```
/lesson/[id]
│
├── Load lesson data from course.json via lib/content.ts
├── Resolve audio paths → bundled require() via AUDIO_MAP
│
├── currentIndex = 0
│   ↓
├── Render exercise at currentIndex
│   ├── multiple-choice   → MultipleChoiceExercise
│   ├── listening         → ListeningExercise
│   ├── matching-pairs    → MatchingPairsExercise
│   └── tap-to-build      → TapToBuildExercise
│
├── User answers → handleSelect(answer)
│   ├── isLocked = true
│   └── Show FeedbackContainer (correct/wrong)
│
├── Tap "Next"
│   ├── If not last exercise → currentIndex++
│   └── If last exercise → markComplete(lessonId)
│                        → navigate to /lesson/summary
│
└── /lesson/summary
    ├── Receives: correct count, total, elapsed seconds, lessonId
    ├── Calculates score %
    ├── Displays tier: Low (<40%) / Intermediate (40–69%) / Advanced (≥70%)
    └── "Next Unit" → back to home
```

---

## 10. Authentication Flow

```
App boot
  └─ initialize() called in _layout.tsx
      ├─ supabase.auth.getSession()
      │    ├─ Session found → set user in store
      │    └─ No session → user = null
      └─ 3s hard fallback (prevents infinite loading)

User = null → router.replace('/sign-in')
User exists → render (tabs) layout

Sign-In screen:
  signIn(email, password)
  └─ supabase.auth.signInWithPassword()
      ├─ Success → router.replace('/')
      └─ Error → display error.message

Sign-Up screen:
  signUp(email, password)
  └─ supabase.auth.signUp()
      ├─ Success → router.replace('/')
      └─ Error → display error.message

Note: Supabase email confirmation is currently ON by default.
      Disable in Supabase dashboard → Auth → Settings if unwanted.
```

---

## 11. Progress System

### Current State (Local Only)

- Completed lesson IDs are stored in `AsyncStorage` under `kalimni:completed_lessons`
- Progress is **not linked to any user account** and **not synced to Supabase**
- Hydrated once on app boot via `useProgressStore.hydrate()`
- Lesson unlock: if `lesson.requiresPrevious = true`, previous lesson must be completed first
- Visual state: UnitNode shows `open` / `completed` / `locked` variants accordingly

### Known Limitation

Progress is device-local. Logging out and back in does not restore progress because nothing is written to Supabase. Future work: write `completed_lessons` to a Supabase table keyed by `user.id`.

---

## 12. Supabase Setup

| Item | Value |
|---|---|
| Project URL | `https://nuqmvurdvqmbmuikohxt.supabase.co` |
| Auth method | Email + Password |
| Session storage | AsyncStorage (mobile) / URL detection (web) |
| Current tables | None (auth only, no custom tables yet) |
| Email confirmation | Enabled by default — disable in dashboard for dev |

---

## 13. App Configuration (app.json)

- **Orientation**: Portrait only
- **URL scheme**: `arabicapp://`
- **React Compiler**: Enabled (experimental)
- **New Architecture**: Enabled
- **Typed Routes**: Enabled
- **Splash screen**: Resizes with `contain`, white background
- **Android**: Edge-to-edge, adaptive icon
- **iOS**: Tablet supported

---

## 14. NPM Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Launch on Android emulator
npm run ios        # Launch on iOS simulator
npm run web        # Launch in browser
npm run lint       # ESLint (expo config)
```

---

## 15. Known Issues & Limitations

| Area | Issue |
|---|---|
| **Progress** | Local-only, not tied to user account, lost on sign-out |
| **Email confirmation** | Supabase blocks sign-in until email is confirmed |
| **Course content** | Only 1 unit / 3 lessons — needs expansion |
| **Audio** | Limited bundled clips; remote URL support exists but untested at scale |
| **Offline** | No offline sync or queue; app works offline but progress is local only |
| **RTL layout** | Typography supports RTL; full bidirectional layout not fully tested |
| **Explore tab** | Placeholder screen, not part of core learning flow |

---

## 16. Immediate Next Steps (Suggested)

1. **Disable email confirmation** in Supabase dashboard (or add a post-signup confirmation screen)
2. **Persist progress to Supabase** — create a `lesson_progress` table, write on `markComplete`, read on login
3. **Expand course content** — add more units, topics, and levels to `course.json`
4. **Add sign-out** option in the UI (settings screen or profile tab)
5. **Handle audio errors** gracefully in `ListeningExercise`
6. **Test RTL layout** end-to-end on a physical Arabic-locale device
