import * as t from "./index";
// db type

export interface Weight {
  value: number;
  unit: t.WeightUnit;
}

export interface Record {
  [t.ONE_REP_MAX]: {
    weight: Weight;
    time: t.TimeStamp;
  };
}

export type UserDoc = {
  [lift in t.LiftType]: Record;
};

export interface Lift {
  date: t.FirestoreTimestamp;
  weight: Weight;
  type: t.LiftType;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
}
