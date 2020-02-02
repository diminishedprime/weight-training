import * as t from "../../../types";
import { WeightField } from "../WeightField/v1";

export interface LiftDoc {
  date: t.FirestoreTimestamp;
  weight: WeightField;
  type: t.LiftType;
  reps: number;
  warmup: boolean | undefined;
  version: "1";
}
