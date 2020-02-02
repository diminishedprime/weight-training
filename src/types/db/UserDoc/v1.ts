import * as t from "../../../types";
import { RecordField } from "../RecordField/v1";

export type UserDoc = {
  [lift in t.LiftType]: RecordField;
};
