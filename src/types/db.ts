import * as t from "./index";
// db type

export interface Weight {
  value: number;
  unit: t.WeightUnit;
}

export interface MaybeORM {
  [t.ONE_REP_MAX]: { weight: Weight; time: t.Timestamp };
}

export type UserDoc = {
  [lift in t.LiftType]: MaybeORM;
};

export interface Lift {
  date: t.Timestamp;
  weight: Weight;
  type: t.LiftType;
  reps: number;
  warmup: boolean | undefined;
}
