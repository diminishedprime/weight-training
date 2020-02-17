import { LiftType } from "../LiftType/v1";
import { RecordField } from "../RecordField/v2";

type UserDocContents = {
  [lift in LiftType]: RecordField;
};

export type UserDoc = {
  version: "2";
} & UserDocContents;
