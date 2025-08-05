import { ExerciseType, ProgramDayType, WeightUnit } from "@/common-types";
import { Constants } from "@/database.types";
import { Map as ImmutableMap, Set as ImmutableSet } from "immutable";

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
export const COMMON_AVAILABLE_PLATES: number[] = [2.5, 5, 10, 25, 45];

export const AVAILABLE_DUMBBELLS: Array<number> = [
  1, 2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80,
  85, 90, 95, 100,
];

export const WENDLER_EXERCISE_TYPES = [
  "barbell_back_squat",
  "barbell_bench_press",
  "barbell_overhead_press",
  "barbell_deadlift",
] as const;

const AVAILABLE_KETTLEBELLS_LBS = [18, 26, 35, 44, 53];

export const DEFAULT_VALUES = {
  PREFERRED_WEIGHT_UNIT: "pounds" as WeightUnit,
  REST_TIME_SECONDS: 120,
  AVAILABLE_PLATES_LBS: AVAILABLE_PLATES,
  AVAILABLE_DUMBBELLS_LBS: AVAILABLE_DUMBBELLS,
  COMMON_DUMBBELLS_LBS: AVAILABLE_DUMBBELLS.filter((a) => a <= 60),
  AVAILABLE_KETTLEBELLS_LBS: AVAILABLE_KETTLEBELLS_LBS,
  SELECTED_PLATES: COMMON_AVAILABLE_PLATES,
};

const dayTypesForExercise = (
  exercise: ExerciseType,
): ImmutableSet<ProgramDayType> => {
  switch (exercise) {
    case "barbell_romanian_deadlift":
    case "barbell_deadlift":
    case "barbell_row":
    case "barbell_snatch":
    case "dumbbell_row":
    case "dumbbell_bicep_curl":
    case "dumbbell_hammer_curl":
    case "dumbbell_wrist_curl":
    case "dumbbell_preacher_curl":
    case "kettlebell_row":
    case "bodyweight_pullup":
    case "bodyweight_chinup":
    case "machine_diverging_lat_pulldown":
    case "machine_diverging_low_row":
    case "machine_back_extension":
    case "machine_biceps_curl":
    case "machine_rear_delt":
    case "machine_assissted_chinup":
    case "machine_assissted_pullup":
      return ImmutableSet(["pull"]);

    case "barbell_front_squat":
    case "barbell_back_squat":
    case "barbell_single_leg_squat":
    case "dumbbell_split_squat":
    case "kettlebell_front_squat":
    case "machine_leg_extension":
    case "machine_seated_leg_curl":
    case "machine_leg_press":
    case "machine_inner_thigh":
    case "machine_outer_thigh":
    case "plate_stack_calf_raise":
      return ImmutableSet(["legs"]);

    case "barbell_incline_bench_press":
    case "barbell_bench_press":
    case "barbell_hip_thrust":
    case "dumbbell_bench_press":
    case "dumbbell_incline_bench_press":
    case "dumbbell_lateral_raise":
    case "dumbbell_skull_crusher":
    case "bodyweight_pushup":
    case "bodyweight_dip":
    case "machine_converging_chest_press":
    case "machine_triceps_extension":
    // IDK
    case "machine_pec_fly":
    case "machine_assissted_dip":
    case "machine_cable_triceps_pushdown":
      return ImmutableSet(["push"]);

    case "barbell_overhead_press":
    case "dumbbell_overhead_press":
    case "dumbbell_fly":
    // IDK
    case "dumbbell_front_raise":
    case "dumbbell_shoulder_press":
    case "machine_converging_shoulder_press":
    case "machine_lateral_raise":
      return ImmutableSet(["shoulders"]);

    case "barbell_clean_and_jerk":
      return ImmutableSet(["pull", "push", "shoulders"]);

    // IDK
    case "bodyweight_situp":
    case "kettlebell_swings":
    case "machine_abdominal":
      // TODO: This just makes these show up everywhere which isn't quite right,
      // but should be close enough.
      return ImmutableSet(["pull", "push", "shoulders", "legs"]);

    default:
      const _exhaustiveCheck: never = exercise; // This is to satisfy TypeScript that this is exhaustive.
      return _exhaustiveCheck;
  }
};

const exercisesForDayType = (
  dayType: ProgramDayType,
): ImmutableSet<ExerciseType> =>
  ImmutableSet(
    Constants.public.Enums.exercise_type_enum.filter((e) =>
      dayTypesForExercise(e).has(dayType),
    ),
  );

export const EXERCISES_FOR_DAY_TYPE: ImmutableMap<
  ProgramDayType,
  ImmutableSet<ExerciseType>
> = Constants.public.Enums.program_day_types_enum.reduce(
  (acc, dayType) => acc.set(dayType, exercisesForDayType(dayType)),
  ImmutableMap<ProgramDayType, ImmutableSet<ExerciseType>>(),
);

export const DAY_TYPES_FOR_EXERCISE: ImmutableMap<
  ExerciseType,
  ImmutableSet<ProgramDayType>
> = Constants.public.Enums.exercise_type_enum.reduce(
  (acc, exercise) => acc.set(exercise, dayTypesForExercise(exercise)),
  ImmutableMap<ExerciseType, ImmutableSet<ProgramDayType>>(),
);

export const EXERCISE_TYPES = ImmutableSet(
  Constants.public.Enums.exercise_type_enum,
);

export const FIRST_PAGE_NUM = 1;

export * from "@/constants/db";
export * from "@/constants/paths";
