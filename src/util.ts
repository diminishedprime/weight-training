import {
  EquipmentType,
  ExerciseType,
  RequiredNonNullable,
  RoundingMode,
} from "@/common-types";
import { Constants } from "@/database.types";
import { notFound } from "next/navigation";

/**
 * Determines the corresponding equipment for a given lift type.
 *
 * @param exerciseType The type of the exercise (e.g., "barbell_deadlift").
 * @returns The equipment type that corresponds to the given lift type.
 */
export function equipmentForExercise(
  exerciseType: ExerciseType,
): EquipmentType {
  switch (exerciseType) {
    // --- barbell ---
    case "barbell_deadlift":
    case "barbell_romanian_deadlift":
    case "barbell_back_squat":
    case "barbell_front_squat":
    case "barbell_bench_press":
    case "barbell_incline_bench_press":
    case "barbell_overhead_press":
    case "barbell_row":
    case "barbell_snatch":
    case "barbell_clean_and_jerk":
    case "barbell_hip_thrust":
    case "barbell_single_leg_squat":
      return "barbell";
    // --- end barbell ---

    // --- bodyweight ---
    case "bodyweight_chinup":
    case "bodyweight_pullup":
    case "bodyweight_pushup":
    case "bodyweight_situp":
    case "bodyweight_dip":
      return "bodyweight";
    // --- end bodyweight ---

    // --- dumbbell ---
    case "dumbbell_bench_press":
    case "dumbbell_incline_bench_press":
    case "dumbbell_overhead_press":
    case "dumbbell_bicep_curl":
    case "dumbbell_hammer_curl":
    case "dumbbell_row":
    case "dumbbell_wrist_curl":
    case "dumbbell_fly":
    case "dumbbell_lateral_raise":
    case "dumbbell_skull_crusher":
    case "dumbbell_preacher_curl":
    case "dumbbell_front_raise":
    case "dumbbell_shoulder_press":
    case "dumbbell_split_squat":
      return "dumbbell";
    // --- end dumbbell ---

    // --- kettlebell ---
    case "kettlebell_row":
    case "kettlebell_swings":
    case "kettlebell_front_squat":
      return "kettlebell";
    // --- end kettlebell ---

    // --- machine ---
    case "machine_converging_chest_press":
    case "machine_diverging_lat_pulldown":
    case "machine_diverging_low_row":
    case "machine_converging_shoulder_press":
    case "machine_lateral_raise":
    case "machine_abdominal":
    case "machine_leg_extension":
    case "machine_seated_leg_curl":
    case "machine_leg_press":
    case "machine_back_extension":
    case "machine_pec_fly":
    case "machine_biceps_curl":
    case "machine_inner_thigh":
    case "machine_outer_thigh":
    case "machine_triceps_extension":
    case "machine_rear_delt":
    case "machine_assissted_chinup":
    case "machine_assissted_pullup":
    case "machine_assissted_dip":
    case "machine_cable_triceps_pushdown":
      return "machine";
    // --- end machine ---

    // --- plate_stack ---
    case "plate_stack_calf_raise":
      return "plate_stack";
    // --- end plate_stack ---

    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = exerciseType;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
}

const roundingFunction = (
  roundingMode: RoundingMode,
  nearest: number,
  toRound: number,
) => {
  const floor = Math.floor(toRound / nearest) * nearest;
  const ceil = Math.ceil(toRound / nearest) * nearest;
  const round = Math.round(toRound / nearest) * nearest;
  switch (roundingMode) {
    case RoundingMode.UP:
      return ceil;
    case RoundingMode.DOWN:
      return floor;
    case RoundingMode.NEAREST:
    default:
      // Pick the candidate closest to toRound
      const candidates = [floor, round, ceil];
      let best = candidates[0];
      let minDiff = Math.abs(toRound - best);
      for (let i = 1; i < candidates.length; i++) {
        const diff = Math.abs(toRound - candidates[i]);
        if (diff < minDiff) {
          minDiff = diff;
          best = candidates[i];
        }
      }
      return best;
  }
};

// Returns the minimal set of plates needed to reach a target weight.
export function minimalPlates(
  targetWeight: number,
  availablePlates: number[],
  roundingMode: RoundingMode,
): { plates: number[]; rounded: boolean } {
  // Ensure plates are sorted in descending order, if we ever do profiling and
  // this is a bottleneck, we can make it where callers have to sort ahead of
  // time, but I doubt we'll ever be there.
  availablePlates.sort((a, b) => b - a);
  const smallestPlate = availablePlates[availablePlates.length - 1];
  const rounded = roundingFunction(roundingMode, smallestPlate, targetWeight);

  let remaining = rounded;
  const result: number[] = [];
  for (const plate of availablePlates) {
    while (remaining >= plate) {
      result.push(plate);
      remaining -= plate;
    }
  }
  return { plates: result, rounded: remaining !== targetWeight };
}

// Convenience function to make it easier to call minimalPlates from the UI
// where in practice, we have a barWeight and a targetWeight.
export function minimalPlatesForTargetWeight(
  targetWeight: number,
  barWeight: number,
  availablePlates: number[],
  roundingMode: RoundingMode,
): { plates: number[]; rounded: boolean } {
  const minusBar = targetWeight - barWeight;
  const platesForOneSideWeight = minusBar / 2;
  const platesForOneSide = minimalPlates(
    platesForOneSideWeight,
    availablePlates,
    roundingMode,
  );
  return platesForOneSide;
}

const sum = (a: number, b: number) => a + b;

// Uses the utility functions for determining the actualWeight for a given
// targetWeight based on availablePlates and bar weight.
export function actualWeightForTarget(
  targetWeight: number,
  barWeight: number,
  availablePlates: number[],
  roundingMode: RoundingMode,
): { actualWeight: number; rounded: boolean } {
  const platesForOneSide = minimalPlatesForTargetWeight(
    targetWeight,
    barWeight,
    availablePlates,
    roundingMode,
  );
  const platesforOneSideWeight = platesForOneSide.plates.reduce(sum, 0);
  const totalPlatesWeight = platesforOneSideWeight * 2;
  const actualWeight = barWeight + totalPlatesWeight;
  return { actualWeight, rounded: platesForOneSide.rounded };
}

export const getExercisesByEquipment = (): Record<
  EquipmentType,
  ExerciseType[]
> => {
  const exercisesByEquipment = {} as Record<EquipmentType, ExerciseType[]>;

  for (const equipment of Constants.public.Enums.equipment_type_enum) {
    exercisesByEquipment[equipment] = [];
  }

  for (const exercise of Constants.public.Enums.exercise_type_enum) {
    const equipment = equipmentForExercise(exercise);
    if (exercisesByEquipment[equipment]) {
      exercisesByEquipment[equipment].push(exercise);
    }
  }

  return exercisesByEquipment;
};

export const EXERCISES_BY_EQUIPMENT = getExercisesByEquipment();
export const BARBELL_EXERCISES = EXERCISES_BY_EQUIPMENT["barbell"];

/**
 * Pre-computed Set of valid barbell form draft paths for O(1) lookup.
 * Generated from the barbell exercises in EXERCISES_BY_EQUIPMENT.
 */
export const VALID_BARBELL_FORM_DRAFT_PATHS = new Set(
  EXERCISES_BY_EQUIPMENT["barbell"].map((exercise) => `/exercise/${exercise}`),
);

export type SortableEquipment = Record<EquipmentType, number>;

// Utility: Map equipment type to a sortable number
export const equipmentToNum: SortableEquipment =
  Constants.public.Enums.equipment_type_enum
    .map((a, idx) => ({ [a]: idx }))
    .reduce((a, b) => ({ ...a, ...b }), {}) as never as SortableEquipment;

/**
 * Comparison function for exercises.
 * @param a - First preference object
 * @param b - Second preference object
 * @returns -1, 0, or 1 for sort order
 */
export const exerciseSorter = (
  a: { exercise_type: ExerciseType },
  b: { exercise_type: ExerciseType },
) => {
  const aNum = equipmentToNum[equipmentForExercise(a.exercise_type!)];
  const bNum = equipmentToNum[equipmentForExercise(b.exercise_type!)];
  if (aNum < bNum) {
    return -1;
  }
  if (aNum > bNum) {
    return 1;
  }
  // If equipment is the same, sort alphabetically by exercise_type
  if (a.exercise_type! < b.exercise_type!) {
    return -2;
  }
  if (a.exercise_type! > b.exercise_type!) {
    return 2;
  }
  return 0;
};

export const sortPreferencesData = (
  preferencesData: Array<{
    exercise_type: ExerciseType;
  }>,
) => {
  preferencesData.sort((a, b) => exerciseSorter(a, b));
  return preferencesData;
};

/**
 * Converts weight from kg to lbs
 */
export const kgToLbs = (kg: number): number => kg * 2.20462;

/**
 * Converts weight from lbs to kg
 */
export const lbsToKg = (lbs: number): number => lbs / 2.20462;

/**
 * Normalizes weight value to pounds for chart display
 */
export const normalizeWeightToLbs = (value: number, unit: string): number => {
  return unit === "kg" ? kgToLbs(value) : value;
};

/**
 * Compares two arrays of primitive types for equality
 * @param a First array
 * @param b Second array
 * @returns true if arrays have same length and same elements in same order
 */
export const arrayEquals = <T extends string | number | boolean>(
  a: T[],
  b: T[],
): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((val, index) => val === b[index]);
};

/**
 * Compares two arrays of primitive types for equality, handling null/undefined cases
 * @param a First array (can be null/undefined)
 * @param b Second array (can be null/undefined)
 * @returns true if arrays are equal (including both being null/undefined)
 */
export const nullableArrayEquals = <T extends string | number | boolean>(
  a: T[] | null | undefined,
  b: T[] | null | undefined,
): boolean => {
  // Both null/undefined
  if (!a && !b) {
    return true;
  }
  // One null/undefined, other not
  if (!a || !b) {
    return false;
  }
  // Both exist, use regular arrayEquals
  return arrayEquals(a, b);
};

export const requiredKeys = <T, K extends keyof T>(
  input: T,
  requiredKeys: K[],
): RequiredNonNullable<T, K> => {
  for (const key of requiredKeys) {
    if (input[key] === null || input[key] === undefined) {
      throw new Error(`Missing required key: ${String(key)}`);
    }
  }
  return input as RequiredNonNullable<T, K>;
};

export function fractionWeightFormat(value: number): string {
  const FRACTIONS: Record<number, string> = {
    0.25: "¼",
    0.5: "½",
    0.75: "¾",
  };
  const intPart = Math.floor(value);
  const fracPart = Number((value - intPart).toFixed(2));
  if (fracPart in FRACTIONS && intPart > 0) {
    return `${intPart}${FRACTIONS[fracPart]}`;
  } else if (value in FRACTIONS) {
    return FRACTIONS[value];
  } else {
    return value.toString();
  }
}

export function narrowOrNotFound<UnNarrowed, Narrowed extends UnNarrowed>(
  value: UnNarrowed,
  narrowFn: (v: UnNarrowed) => v is Narrowed,
): Narrowed {
  if (narrowFn(value)) {
    return value;
  }
  notFound();
}

export const narrowEquipmentType = (s: string): s is EquipmentType =>
  Constants.public.Enums.equipment_type_enum.includes(s as EquipmentType);

export const narrowExerciseType = (s: string): s is ExerciseType =>
  Constants.public.Enums.exercise_type_enum.includes(s as ExerciseType);

export function notFoundIfNull<T>(
  value: T | null | undefined,
): asserts value is T {
  if (value === null) {
    notFound();
  }
}
