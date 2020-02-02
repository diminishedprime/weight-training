import * as t from "../index";
import { WeightField } from "./WeightField";

export * from "./WeightField";
export * from "./TimeStampField";
export * from "./UserDoc";

export enum LiftDocType {
  BARBELL = "barbell"
}

interface DeadliftDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: t.LiftType.DEADLIFT;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

interface SquatDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: t.LiftType.SQUAT;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

interface FrontSquatDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: t.LiftType.FRONT_SQUAT;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

interface BenchPressDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: t.LiftType.BENCH_PRESS;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

interface OverheadPressDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: t.LiftType.OVERHEAD_PRESS;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

export type LiftDoc =
  | DeadliftDoc
  | SquatDoc
  | FrontSquatDoc
  | BenchPressDoc
  | OverheadPressDoc;
