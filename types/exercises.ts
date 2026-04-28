// Shared controlled-component contract for all exercise types.
// string[] accommodates future multi-part answers (matching pairs, tap-to-build).
// Multiple Choice uses only the string branch.
export type ExerciseComponentProps<TData> = {
  data: TData;
  selectedAnswer: string | string[] | null;
  isLocked: boolean;
  onSelect: (answer: string | string[]) => void;
};
