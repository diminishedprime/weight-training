import * as t from "../../../types";
import { RecordField } from "../RecordField";

export type UserDoc = {
  [lift in t.LiftType]: RecordField;
};
