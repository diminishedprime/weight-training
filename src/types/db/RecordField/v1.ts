import * as t from "../../../types";
import { WeightField } from "../WeightField";
import { TimeStampField } from "../TimeStampField";

export interface RecordField {
  [t.ONE_REP_MAX]: {
    weight: WeightField;
    time: TimeStampField;
  };
}
