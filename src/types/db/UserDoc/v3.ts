import { RecordField } from "../RecordField/v2";
import { LiftType } from "../LiftType/v2";

type UserDocContents = {
  [lift in LiftType]: RecordField;
};

export type UserDoc = {
  version: "3";
} & UserDocContents;
