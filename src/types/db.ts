import * as t from "./index";
// db type

export interface WeightField {
  value: number;
  unit: t.WeightUnit;
  version: "1";
}

export interface TimeStampField {
  seconds: number;
  nanoseconds: number;
}

export interface RecordField {
  [t.ONE_REP_MAX]: {
    weight: WeightField;
    time: TimeStampField;
  };
}

export type UserDoc = {
  [lift in t.LiftType]: RecordField;
};

export interface LiftDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: t.LiftType;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
}
