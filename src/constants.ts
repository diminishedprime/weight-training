import { ExerciseType } from "@/common-types";

export const DEFAULT_BAR_WEIGHT = 45; // lbs
export const ALL_PLATES = [55, 45, 35, 25, 10, 5, 2.5];
export const DEFAULT_PLATE_SIZES = [45, 25, 10, 5, 2.5];

export const PLATE_COLORS: Record<number, { bg: string; fg: string }> = {
  45: { bg: "red", fg: "white" },
  35: { bg: "blue", fg: "white" },
  25: { bg: "yellow", fg: "black" },
  10: { bg: "green", fg: "white" },
  5: { bg: "black", fg: "white" },
  2.5: { bg: "pink", fg: "black" },
  1.25: { bg: "orange", fg: "black" },
};

export const AVAILABLE_PLATES: number[] = [
  1.25, 2.5, 5, 10, 25, 35, 45, 50, 55, 100,
];
export const COMMON_AVAILABLE_PLATES: number[] = [2.5, 5, 10, 25, 35, 45];

export const WENDLER_EXERCISE_TYPES: ExerciseType[] = [
  "barbell_overhead_press",
  "barbell_bench_press",
  "barbell_back_squat",
  "barbell_deadlift",
];
