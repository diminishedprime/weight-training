import { Database } from "@/database.types";

type LiftType = Database["public"]["Enums"]["exercise_type_enum"];
export const exerciseTypeUIString = (type: LiftType): string => {
  switch (type) {
    case "barbell_deadlift":
      return "Deadlift";
    case "barbell_squat":
      return "Squat";
    case "barbell_bench_press":
      return "Bench Press";
    case "barbell_overhead_press":
      return "Overhead Press";
    case "barbell_row":
      return "Barbell Row";
    case "dumbbell_row":
      return "Dumbbell Row";
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
  }
};

export const weightUnitUIString = (
  unit: Database["public"]["Enums"]["weight_unit_enum"]
): string => {
  switch (unit) {
    case "kilograms":
      return "kgs";
    case "pounds":
      return "lbs";
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = unit;
      return _exhaustiveCheck;
    }
  }
};

export const completionStatusUIString = (
  status: Database["public"]["Enums"]["completion_status_enum"]
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
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
    }
  }
};

export const equipmentTypeUIString = (
  type: Database["public"]["Enums"]["equipment_type_enum"]
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
    default: {
      // This will cause a type error if a new enum value is added and not handled
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
  }
};
