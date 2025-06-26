import { Constants, Database } from "@/database.types";

/**
 * Determines the corresponding equipment for a given lift type.
 *
 * @param lift_type The type of the exercise (e.g., "barbell_deadlift").
 * @returns The equipment type that corresponds to the given lift type.
 */
export function equipmentForExercise(
  lift_type: Database["public"]["Enums"]["exercise_type_enum"],
): Database["public"]["Enums"]["equipment_type_enum"] {
  switch (lift_type) {
    case "barbell_deadlift":
      return "barbell";
    case "barbell_back_squat":
      return "barbell";
    case "barbell_front_squat":
      return "barbell";
    case "barbell_bench_press":
      return "barbell";
    case "barbell_overhead_press":
      return "barbell";
    case "barbell_row":
      return "barbell";
    case "dumbbell_row":
      return "dumbbell";
    case "chinup":
      return "bodyweight";
    case "pullup":
      return "bodyweight";
    case "pushup":
      return "bodyweight";
    case "situp":
      return "bodyweight";
    case "machine_converging_chest_press":
      return "machine";
    case "machine_diverging_lat_pulldown":
      return "machine";
    case "machine_diverging_low_row":
      return "machine";
    case "machine_converging_shoulder_press":
      return "machine";
    case "machine_lateral_raise":
      return "machine";
    case "machine_abdominal":
      return "machine";
    case "machine_leg_extension":
      return "machine";
    case "machine_seated_leg_curl":
      return "machine";
    case "machine_leg_press":
      return "machine";
    case "machine_back_extension":
      return "machine";
    case "machine_pec_fly":
      return "machine";
    case "machine_biceps_curl":
      return "machine";
    case "machine_inner_thigh":
      return "machine";
    case "machine_outer_thigh":
      return "machine";
    case "machine_triceps_extension":
      return "machine";
    case "machine_rear_delt":
      return "machine";
    case "plate_stack_calf_raise":
      return "plate_stack";
    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = lift_type;
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
  Database["public"]["Enums"]["equipment_type_enum"],
  Database["public"]["Enums"]["exercise_type_enum"][]
> => {
  const exercisesByEquipment = {} as Record<
    Database["public"]["Enums"]["equipment_type_enum"],
    Database["public"]["Enums"]["exercise_type_enum"][]
  >;

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

// Types
export type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];

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
  a: { exercise_type: Database["public"]["Enums"]["exercise_type_enum"] },
  b: { exercise_type: Database["public"]["Enums"]["exercise_type_enum"] },
) => {
  const aNum = equipmentToNum[equipmentForExercise(a.exercise_type!)];
  const bNum = equipmentToNum[equipmentForExercise(b.exercise_type!)];
  if (aNum < bNum) return -1;
  if (aNum > bNum) return 1;
  // If equipment is the same, sort alphabetically by exercise_type
  if (a.exercise_type! < b.exercise_type!) return -2;
  if (a.exercise_type! > b.exercise_type!) return 2;
  return 0;
};

export const sortPreferencesData = (
  preferencesData: Array<{
    exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
  }>,
) => {
  preferencesData.sort((a, b) => exerciseSorter(a, b));
  return preferencesData;
};

/**
 * Returns the bump amount (5 or 10) based on whether the exercise is primarily lower or upper body.
 * Explicitly handles every exercise_type_enum variant and uses an exhaustive check.
 * @param exerciseType - The exercise type enum value.
 * @returns The bump amount in lbs (10 for lower body, 5 for upper body).
 */
export const getBumpAmountForExerciseType = (
  exerciseType: Database["public"]["Enums"]["exercise_type_enum"],
): number => {
  switch (exerciseType) {
    case "barbell_deadlift":
      return 10;
    case "barbell_back_squat":
      return 10;
    case "barbell_front_squat":
      return 10;
    case "machine_leg_press":
      return 10;
    case "machine_leg_extension":
      return 5;
    case "machine_seated_leg_curl":
      return 5;
    case "machine_inner_thigh":
      return 5;
    case "machine_outer_thigh":
      return 5;
    case "plate_stack_calf_raise":
      return 5;
    case "barbell_bench_press":
      return 5;
    case "barbell_overhead_press":
      return 5;
    case "barbell_row":
      return 5;
    case "dumbbell_row":
      return 5;
    case "machine_converging_chest_press":
      return 5;
    case "machine_diverging_lat_pulldown":
      return 5;
    case "machine_diverging_low_row":
      return 5;
    case "machine_converging_shoulder_press":
      return 5;
    case "machine_lateral_raise":
      return 5;
    case "machine_abdominal":
      return 5;
    case "machine_back_extension":
      return 5;
    case "machine_pec_fly":
      return 5;
    case "machine_biceps_curl":
      return 5;
    case "machine_triceps_extension":
      return 5;
    case "machine_rear_delt":
      return 5;
    case "pushup":
      return 5;
    case "situp":
      return 5;
    case "pullup":
      return 5;
    case "chinup":
      return 5;
    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = exerciseType;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};
