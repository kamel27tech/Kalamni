// types/content.ts
// Content type definitions for Kalimni Arabic learning course

export type LocalizedText = {
  en: string;
  ar: string;
};

export type Course = {
  id: string;
  language: string;
  dialect: string;
  version: string;
  levels: Level[];
};

export type Level = {
  id: string;
  order: number;
  code: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  color?: string;
  topics: Topic[];
};

export type Topic = {
  id: string;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  requiresPrevious: boolean;
  units: Unit[];
};

export type Unit = {
  id: string;
  order: number;
  title: LocalizedText;
  icon: string;
  requiresPrevious: boolean;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  order: number;
  title: LocalizedText;
  estimatedMinutes: number;
  requiresPrevious: boolean;
  exercises: Exercise[];
};

export type Exercise =
  | MultipleChoiceExercise
  | ListeningExercise
  | MatchingPairsExercise
  | TapToBuildExercise;

export type MultipleChoiceExercise = {
  id: string;
  type: 'multiple-choice';
  order: number;
  data: {
    prompt: string;
    promptAudio?: string;
    correctAnswer: string;
    options: Array<{
      text: string;
      transliteration?: string;
      audio?: string;
    }>;
  };
};

export type ListeningExercise = {
  id: string;
  type: 'listening';
  order: number;
  data: {
    prompt: string;
    audioUrl: string;
    correctAnswerId: string;
    options: Array<{
      id: string;
      text: string;
      transliteration?: string;
    }>;
  };
};

export type MatchingPairsExercise = {
  id: string;
  type: 'matching-pairs';
  order: number;
  data: {
    prompt: string;
    pairs: Array<{
      left: string;
      right: string;
      audio?: string;
    }>;
  };
};

export type TapToBuildExercise = {
  id: string;
  type: 'tap-to-build';
  order: number;
  data: {
    prompt: string;
    correctAnswer: string[];
    wordBank: string[];
    translation: string;
    audio?: string;
  };
};