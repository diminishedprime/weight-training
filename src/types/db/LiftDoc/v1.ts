import * as t from "../../../types";
import { WeightField } from "../WeightField/v1";
import { LiftType } from "../LiftType/v1";

export interface LiftDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: LiftType;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
}
