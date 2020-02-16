import * as t from "../../../types";
import { LiftType } from "../LiftType/v1";
import { WeightField } from "../WeightField";

export enum LiftDocType {
  BARBELL = "barbell"
}

interface DeadliftDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.DEADLIFT;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

interface SquatDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.SQUAT;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

interface FrontSquatDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.FRONT_SQUAT;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

interface BenchPressDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.BENCH_PRESS;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
  liftDocType: LiftDocType.BARBELL;
  liftDocVersion: "1";
}

interface OverheadPressDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: LiftType.OVERHEAD_PRESS;
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
