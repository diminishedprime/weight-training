import { Database } from "@/database.types";
import { correspondingEquipment } from "./util";

type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
export const exerciseTypeUIStringBrief = (type: ExerciseType): string => {
  switch (type) {
    case "barbell_deadlift":
      return "Deadlift";
    case "barbell_squat":
      return "Squat";
    case "barbell_bench_press":
      return "Bench Press";
    case "barbell_row":
      return "Row";
    case "barbell_overhead_press":
      return "Overhead Press";
    case "dumbbell_row":
      return "Row";
    case "pushup":
      return "Push Up";
    case "situp":
      return "Sit Up";
    case "pullup":
      return "Pull Up";
    case "chinup":
      return "Chin Up";
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
    case "plate_stack_calf_raise":
      return "Calf Raise";

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
    correspondingEquipment(type),
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
    case "not_completed":
      return "Not Completed";
    case "failed":
      return "Failed";
    case "skipped":
      return "Skipped";

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
