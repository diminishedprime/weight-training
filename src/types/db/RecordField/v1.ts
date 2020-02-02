import * as t from "../../../types";
import { TimeStampField } from "../TimeStampField/v1";
import { WeightField } from "../WeightField/v1";

export interface RecordField {
  [t.ONE_REP_MAX]: {
    weight: WeightField;
    time: TimeStampField;
  };
}
