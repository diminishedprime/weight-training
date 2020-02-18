import { FirestoreTimestamp } from "../../common";
import { LiftType as LiftTypeV1 } from "../LiftType/v1";
import { LiftType, migrateV1 as liftTypeMigrateV1 } from "../LiftType/v2";
import { WeightField } from "../WeightField";
import { LiftDoc as V2 } from "./v2";

export interface DeadliftDoc {
  date: FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.Deadlift;
  reps: number;
  warmup: boolean;
}

export interface SquatDoc {
  date: FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.Squat;
  reps: number;
  warmup: boolean;
}

export interface FrontSquatDoc {
  date: FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.FrontSquat;
  reps: number;
  warmup: boolean;
}

export interface BenchPressDoc {
  date: FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.BenchPress;
  reps: number;
  warmup: boolean;
}

export interface OverheadPressDoc {
  date: FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.OverheadPress;
  reps: number;
  warmup: boolean;
}

export enum SnatchStyle {
  Full = "full",
  Muscle = "muscle",
  Power = "power"
}

export enum SnatchPosition {
  HighHang = "high-hang",
  AboveTheKnee = "above-the-knee",
  BelowTheKnee = "below-the-knee",
  Floor = "floor"
}

export interface SnatchDoc {
  date: FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.Snatch;
  reps: number;
  warmup: boolean;
  style: SnatchStyle;
  startPosition: SnatchPosition;
}

export enum CleanAndJerkStyle {
  Full = "full",
  Muscle = "muscle",
  Power = "power"
}

export enum CleanAndJerkPosition {
  HighHang = "high-hang",
  AboveTheKnee = "above-the-knee",
  BelowTheKnee = "below-the-knee",
  Floor = "floor"
}

export interface CleanAndJerkDoc {
  date: FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.CleanAndJerk;
  reps: number;
  warmup: boolean;
  style: CleanAndJerkStyle;
  startPosition: CleanAndJerkPosition;
}

type BaseLiftDoc =
  | CleanAndJerkDoc
  | SnatchDoc
  | DeadliftDoc
  | SquatDoc
  | FrontSquatDoc
  | BenchPressDoc
  | OverheadPressDoc;

export type LiftDoc = BaseLiftDoc & { version: "3" };

export const migrateV2 = (v2: V2): LiftDoc => {
  const type = liftTypeMigrateV1(v2.type);
  const baseDoc = {
    warmup: v2.warmup || false,
    reps: v2.reps,
    date: v2.date,
    weight: v2.weight,
    type
  };
  switch (v2.type) {
    case LiftTypeV1.BENCH_PRESS:
      return { ...(baseDoc as BenchPressDoc), version: "3" };
    case LiftTypeV1.DEADLIFT:
      return { ...(baseDoc as DeadliftDoc), version: "3" };
    case LiftTypeV1.FRONT_SQUAT:
      return { ...(baseDoc as FrontSquatDoc), version: "3" };
    case LiftTypeV1.OVERHEAD_PRESS:
      return { ...(baseDoc as OverheadPressDoc), version: "3" };
    case LiftTypeV1.SQUAT:
      return { ...(baseDoc as SquatDoc), version: "3" };
  }
};
