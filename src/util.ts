import { Constants } from "@/database.types";
import { EquipmentType, ExerciseType } from "@/common-types";

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

/**
 * Calculates the minimal set of plates needed to achieve a target weight for one side of a barbell or a single dumbbell.
 *
 * This function assumes that the `availablePlates` array is sorted in descending order of weight.
 * It greedily selects the largest possible plates to make up the `targetWeight`.
 * If the `targetWeight` cannot be exactly achieved with the `availablePlates`,
 * the function will return the plates that sum up to the closest weight less than or equal to the `targetWeight`.
 *
 * @param targetWeight The desired weight to achieve (e.g., for one side of a barbell, or a single dumbbell weight).
 * @param availablePlates An array of numbers representing the weights of available plates, sorted in descending order.
 * @returns An array of numbers representing the plates selected to make up the target weight. The array will contain duplicates if multiple plates of the same weight are needed.
 */
export function minimalPlates(
  targetWeight: number,
  availablePlates: number[],
): number[] {
  // TODO ideally this would covered elsewhere, but it's complicated to make
  // sure that all callers know to sort.
  availablePlates.sort((a, b) => b - a); // Ensure plates are sorted in descending order
  let remaining = targetWeight;
  const result: number[] = [];
  for (const plate of availablePlates) {
    while (remaining >= plate) {
      result.push(plate);
      remaining -= plate;
    }
  }
  return result;
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
