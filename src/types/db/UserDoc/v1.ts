import * as t from "../../../types";
import { RecordField } from "../RecordField/v1";

type UserDocContents = {
  [lift in t.LiftType]: RecordField;
};

export type UserDoc = { version?: "1" } & UserDocContents;
