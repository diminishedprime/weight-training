import { RecordField } from "../RecordField/v2";
import { LiftType } from "../LiftType/v1";

type UserDocContents = {
  [lift in LiftType]: RecordField;
};

export type UserDoc = {
  version: "2";
} & UserDocContents;
