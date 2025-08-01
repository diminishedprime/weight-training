export const wendlerCycleUIString = (
  cycle: Database["public"]["Enums"]["wendler_cycle_type_enum"],
): string => {
  switch (cycle) {
    case "5":
      return "5s";
    case "3":
      return "3s";
    case "1":
      return "1s";
    case "deload":
      return "Deload";
    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = cycle;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};
import { UserPreferences, WeightUnit } from "@/common-types";
import { Database } from "@/database.types";
import { equipmentForExercise } from "@/util";

type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
export const exerciseTypeUIStringBrief = (type: ExerciseType): string => {
  switch (type) {
    // --- barbell ---
    case "barbell_deadlift":
      return "Deadlift";
    case "barbell_back_squat":
      return "Back Squat";
    case "barbell_front_squat":
      return "Front Squat";
    case "barbell_bench_press":
      return "Bench Press";
    case "barbell_row":
      return "Row";
    case "barbell_overhead_press":
      return "Overhead Press";
    case "barbell_incline_bench_press":
      return "Incline Bench Press";
    case "barbell_romanian_deadlift":
      return "Romanian Deadlift";
    case "barbell_snatch":
      return "Snatch";
    case "barbell_clean_and_jerk":
      return "Clean and Jerk";
    case "barbell_hip_thrust":
      return "Hip Thrust";
    case "barbell_single_leg_squat":
      return "Single Leg Squat";
    // --- end barbell ---

    // --- dumbbell ---
    case "dumbbell_row":
      return "Row";
    case "dumbbell_bench_press":
      return "Bench Press";
    case "dumbbell_incline_bench_press":
      return "Incline Bench Press";
    case "dumbbell_overhead_press":
      return "Overhead Press";
    case "dumbbell_bicep_curl":
      return "Bicep Curl";
    case "dumbbell_hammer_curl":
      return "Hammer Curl";
    case "dumbbell_wrist_curl":
      return "Wrist Curl";
    case "dumbbell_fly":
      return "Fly";
    case "dumbbell_lateral_raise":
      return "Lateral Raise";
    case "dumbbell_skull_crusher":
      return "Skull Crusher";
    case "dumbbell_preacher_curl":
      return "Preacher Curl";
    case "dumbbell_front_raise":
      return "Front Raise";
    case "dumbbell_shoulder_press":
      return "Shoulder Press";
    case "dumbbell_split_squat":
      return "Split Squat";
    // --- end dumbbell ---

    // --- kettlebell ---
    case "kettlebell_row":
      return "Kettlebell Row";
    case "kettlebell_swings":
      return "Kettlebell Swings";
    case "kettlebell_front_squat":
      return "Kettlebell Front Squat";
    // --- end kettlebell ---

    // --- bodyweight ---
    case "bodyweight_pushup":
      return "Push Up";
    case "bodyweight_situp":
      return "Sit Up";
    case "bodyweight_pullup":
      return "Pull Up";
    case "bodyweight_chinup":
      return "Chin Up";
    case "bodyweight_dip":
      return "Dip";
    // --- end bodyweight ---

    // --- machine ---
    case "machine_converging_chest_press":
      return "Converging Chest Press";
    case "machine_diverging_lat_pulldown":
      return "Diverging Lat Pulldown";
    case "machine_diverging_low_row":
      return "Diverging Low Row";
    case "machine_converging_shoulder_press":
      return "Converging Shoulder Press";
    case "machine_lateral_raise":
      return "Lateral Raise";
    case "machine_abdominal":
      return "Abdominal";
    case "machine_leg_extension":
      return "Leg Extension";
    case "machine_seated_leg_curl":
      return "Leg Curl";
    case "machine_leg_press":
      return "Leg Press";
    case "machine_pec_fly":
      return "Pec Fly";
    case "machine_back_extension":
      return "Back Extension";
    case "machine_inner_thigh":
      return "Inner Thigh";
    case "machine_outer_thigh":
      return "Outer Thigh";
    case "machine_triceps_extension":
      return "Triceps Extension";
    case "machine_biceps_curl":
      return "Biceps Curl";
    case "machine_rear_delt":
      return "Rear Delt";
    case "machine_assissted_chinup":
      return "Assisted Chin Up";
    case "machine_assissted_pullup":
      return "Assisted Pull Up";
    case "machine_assissted_dip":
      return "Assisted Dip";
    case "machine_cable_triceps_pushdown":
      return "Cable Triceps Pushdown";
    // --- end machine ---

    // --- plate_stack ---
    case "plate_stack_calf_raise":
      return "Calf Raise";
    // --- end plate_stack ---

    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};
export const exerciseTypeUIStringLong = (type: ExerciseType): string => {
  return `${exerciseTypeUIStringBrief(type)} (${equipmentTypeUIString(
    equipmentForExercise(type),
  )})`;
};

export const weightUnitUIString = (
  unit: Database["public"]["Enums"]["weight_unit_enum"],
): string => {
  switch (unit) {
    case "kilograms":
      return "kgs";
    case "pounds":
      return "lbs";

    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = unit;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};

export const completionStatusUIString = (
  status: Database["public"]["Enums"]["completion_status_enum"],
): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "not_started":
      return "Not Started";
    case "failed":
      return "Failed";
    case "skipped":
      return "Skipped";
    case "in_progress":
      return "In Progress";

    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};

export const equipmentTypeUIString = (
  type: Database["public"]["Enums"]["equipment_type_enum"],
): string => {
  switch (type) {
    case "barbell":
      return "Barbell";
    case "dumbbell":
      return "Dumbbell";
    case "kettlebell":
      return "Kettlebell";
    case "machine":
      return "Machine";
    case "bodyweight":
      return "Bodyweight";
    case "plate_stack":
      return "Plate Stack";

    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};

export const perceivedEffortUIString = (
  type: Database["public"]["Enums"]["perceived_effort_enum"],
): string => {
  switch (type) {
    case "easy":
      return "Easy";
    case "okay":
      return "Okay";
    case "hard":
      return "Hard";

    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};

export const userPreferenceUIString = (
  preference: keyof UserPreferences,
): string => {
  switch (preference) {
    case "preferred_weight_unit":
      return "Weight Unit";
    case "default_rest_time":
      return "Rest Time";
    case "available_plates_lbs":
      return `Available Plates (${weightUnitUIString("pounds")})`;
    case "available_dumbbells_lbs":
      return `Available Dumbbells (${weightUnitUIString("pounds")})`;
    case "available_kettlebells_lbs":
      return `Available Kettlebells (${weightUnitUIString("pounds")})`;
    // These probably shouldn't be mapped to, but that's okay.
    case "user_id":
      return "User ID";
    // Stryker disable all
    /* v8 ignore next 5 */
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = preference;
      return _exhaustiveCheck;
    }
    // Stryker restore all
  }
};

export const uiWeight = (value: number, unit: WeightUnit): string => {
  return `${value}${weightUnitUIString(unit)}`;
};
