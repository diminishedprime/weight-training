import { RecordField } from "../RecordField/v1";
import { LiftType } from "../LiftType/v1";

type UserDocContents = {
  [lift in LiftType]: RecordField;
};

export type UserDoc = { version?: "1" } & UserDocContents;
