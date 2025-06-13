import { describe, it, expect } from "vitest";
import {
  exerciseTypeUIStringBrief,
  exerciseTypeUIStringLong,
  weightUnitUIString,
  completionStatusUIString,
  equipmentTypeUIString,
} from "./uiStrings";
import { Database } from "./database.types";
import { correspondingEquipment } from "./util";

type ExerciseType = Database["public"]["Enums"]["exercise_type_enum"];
type WeightUnit = Database["public"]["Enums"]["weight_unit_enum"];
type CompletionStatus =
  Database["public"]["Enums"]["completion_status_enum"];
type EquipmentType = Database["public"]["Enums"]["equipment_type_enum"];

describe("uiStrings", () => {
  describe("exerciseTypeUIStringBrief", () => {
    it("should return the correct brief string for each exercise type", () => {
      expect(exerciseTypeUIStringBrief("barbell_deadlift" as ExerciseType)).toBe("Deadlift");
      expect(exerciseTypeUIStringBrief("barbell_squat" as ExerciseType)).toBe("Squat");
      expect(exerciseTypeUIStringBrief("barbell_bench_press" as ExerciseType)).toBe("Bench Press");
      expect(exerciseTypeUIStringBrief("barbell_overhead_press" as ExerciseType)).toBe("Overhead Press");
      expect(exerciseTypeUIStringBrief("barbell_row" as ExerciseType)).toBe("Row");
      expect(exerciseTypeUIStringBrief("dumbbell_row" as ExerciseType)).toBe("Row");
      expect(exerciseTypeUIStringBrief("machine_converging_chest_press" as ExerciseType)).toBe("Converging Chest Press");
      expect(exerciseTypeUIStringBrief("machine_diverging_lat_pulldown" as ExerciseType)).toBe("Diverging Lat Pulldown");
      expect(exerciseTypeUIStringBrief("machine_diverging_low_row" as ExerciseType)).toBe("Diverging Low Row");
      expect(exerciseTypeUIStringBrief("machine_converging_shoulder_press" as ExerciseType)).toBe("Converging Shoulder Press");
      expect(exerciseTypeUIStringBrief("machine_lateral_raise" as ExerciseType)).toBe("Lateral Raise");
      expect(exerciseTypeUIStringBrief("machine_abdominal" as ExerciseType)).toBe("Abdominal");
      expect(exerciseTypeUIStringBrief("machine_back_extension" as ExerciseType)).toBe("Back Extension");
      expect(exerciseTypeUIStringBrief("machine_seated_leg_curl" as ExerciseType)).toBe("Leg Curl");
      expect(exerciseTypeUIStringBrief("machine_leg_extension" as ExerciseType)).toBe("Leg Extension");
      expect(exerciseTypeUIStringBrief("machine_leg_press" as ExerciseType)).toBe("Leg Press");
      expect(exerciseTypeUIStringBrief("machine_inner_thigh" as ExerciseType)).toBe("Inner Thigh");
      expect(exerciseTypeUIStringBrief("machine_outer_thigh" as ExerciseType)).toBe("Outer Thigh");
      expect(exerciseTypeUIStringBrief("machine_triceps_extension" as ExerciseType)).toBe("Triceps Extension");
      expect(exerciseTypeUIStringBrief("machine_biceps_curl" as ExerciseType)).toBe("Biceps Curl");
      expect(exerciseTypeUIStringBrief("machine_rear_delt" as ExerciseType)).toBe("Rear Delt");
      expect(exerciseTypeUIStringBrief("machine_pec_fly" as ExerciseType)).toBe("Pec Fly");
      expect(exerciseTypeUIStringBrief("pushup" as ExerciseType)).toBe("Push Up");
      expect(exerciseTypeUIStringBrief("situp" as ExerciseType)).toBe("Sit Up");
      expect(exerciseTypeUIStringBrief("pullup" as ExerciseType)).toBe("Pull Up");
      expect(exerciseTypeUIStringBrief("chinup" as ExerciseType)).toBe("Chin Up");
      expect(exerciseTypeUIStringBrief("plate_stack_calf_raise" as ExerciseType)).toBe("Calf Raise");
    });
  });

  describe("exerciseTypeUIStringLong", () => {
    it("should return the correct long string for each exercise type", () => {
      expect(exerciseTypeUIStringLong("barbell_deadlift" as ExerciseType)).toBe("Deadlift (Barbell)");
      expect(exerciseTypeUIStringLong("barbell_squat" as ExerciseType)).toBe("Squat (Barbell)");
      expect(exerciseTypeUIStringLong("barbell_bench_press" as ExerciseType)).toBe("Bench Press (Barbell)");
      expect(exerciseTypeUIStringLong("barbell_overhead_press" as ExerciseType)).toBe("Overhead Press (Barbell)");
      expect(exerciseTypeUIStringLong("barbell_row" as ExerciseType)).toBe("Row (Barbell)");
      expect(exerciseTypeUIStringLong("dumbbell_row" as ExerciseType)).toBe("Row (Dumbbell)");
      expect(exerciseTypeUIStringLong("machine_converging_chest_press" as ExerciseType)).toBe("Converging Chest Press (Machine)");
      expect(exerciseTypeUIStringLong("machine_diverging_lat_pulldown" as ExerciseType)).toBe("Diverging Lat Pulldown (Machine)");
      expect(exerciseTypeUIStringLong("machine_diverging_low_row" as ExerciseType)).toBe("Diverging Low Row (Machine)");
      expect(exerciseTypeUIStringLong("machine_converging_shoulder_press" as ExerciseType)).toBe("Converging Shoulder Press (Machine)");
      expect(exerciseTypeUIStringLong("machine_lateral_raise" as ExerciseType)).toBe("Lateral Raise (Machine)");
      expect(exerciseTypeUIStringLong("machine_abdominal" as ExerciseType)).toBe("Abdominal (Machine)");
      expect(exerciseTypeUIStringLong("machine_back_extension" as ExerciseType)).toBe("Back Extension (Machine)");
      expect(exerciseTypeUIStringLong("machine_seated_leg_curl" as ExerciseType)).toBe("Leg Curl (Machine)");
      expect(exerciseTypeUIStringLong("machine_leg_extension" as ExerciseType)).toBe("Leg Extension (Machine)");
      expect(exerciseTypeUIStringLong("machine_leg_press" as ExerciseType)).toBe("Leg Press (Machine)");
      expect(exerciseTypeUIStringLong("machine_inner_thigh" as ExerciseType)).toBe("Inner Thigh (Machine)");
      expect(exerciseTypeUIStringLong("machine_outer_thigh" as ExerciseType)).toBe("Outer Thigh (Machine)");
      expect(exerciseTypeUIStringLong("machine_triceps_extension" as ExerciseType)).toBe("Triceps Extension (Machine)");
      expect(exerciseTypeUIStringLong("machine_biceps_curl" as ExerciseType)).toBe("Biceps Curl (Machine)");
      expect(exerciseTypeUIStringLong("machine_rear_delt" as ExerciseType)).toBe("Rear Delt (Machine)");
      expect(exerciseTypeUIStringLong("machine_pec_fly" as ExerciseType)).toBe("Pec Fly (Machine)");
      expect(exerciseTypeUIStringLong("pushup" as ExerciseType)).toBe("Push Up (Bodyweight)");
      expect(exerciseTypeUIStringLong("situp" as ExerciseType)).toBe("Sit Up (Bodyweight)");
      expect(exerciseTypeUIStringLong("pullup" as ExerciseType)).toBe("Pull Up (Bodyweight)");
      expect(exerciseTypeUIStringLong("chinup" as ExerciseType)).toBe("Chin Up (Bodyweight)");
      expect(exerciseTypeUIStringLong("plate_stack_calf_raise" as ExerciseType)).toBe("Calf Raise (Plate Stack)");
    });
  });

  describe("weightUnitUIString", () => {
    it("should return the correct string for each weight unit", () => {
      expect(weightUnitUIString("kilograms" as WeightUnit)).toBe("kgs");
      expect(weightUnitUIString("pounds" as WeightUnit)).toBe("lbs");
    });
  });

  describe("completionStatusUIString", () => {
    it("should return the correct string for each completion status", () => {
      expect(completionStatusUIString("completed" as CompletionStatus)).toBe("Completed");
      expect(completionStatusUIString("not_completed" as CompletionStatus)).toBe("Not Completed");
      expect(completionStatusUIString("failed" as CompletionStatus)).toBe("Failed");
      expect(completionStatusUIString("skipped" as CompletionStatus)).toBe("Skipped");
    });
  });

  describe("equipmentTypeUIString", () => {
    it("should return the correct string for each equipment type", () => {
      expect(equipmentTypeUIString("barbell" as EquipmentType)).toBe("Barbell");
      expect(equipmentTypeUIString("dumbbell" as EquipmentType)).toBe("Dumbbell");
      expect(equipmentTypeUIString("machine" as EquipmentType)).toBe("Machine");
      expect(equipmentTypeUIString("bodyweight" as EquipmentType)).toBe("Bodyweight");
      expect(equipmentTypeUIString("kettlebell" as EquipmentType)).toBe("Kettlebell");
      expect(equipmentTypeUIString("plate_stack" as EquipmentType)).toBe("Plate Stack");
    });
  });
});
