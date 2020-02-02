import * as t from "../../../types";
import { WeightField } from "../WeightField/v1";
import { TimeStampField } from "../TimeStampField/v1";

export interface RecordField {
  [t.ONE_REP_MAX]: {
    weight: WeightField;
    time: TimeStampField;
  };
}
