import * as t from "../../types";
// TODO - instead of keeping the types copied, I can have all the types exist in
// the types, but only export the latest version.

enum LiftDocType {
  BARBELL = "barbell"
}

export interface WeightField {
  value: number;
  unit: t.WeightUnit;
  version: "1";
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
