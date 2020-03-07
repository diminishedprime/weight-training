import { FirestoreField } from "../index";
import { LiftType } from "../LiftType/v2";
import { RecordField } from "../RecordField/v2";

type UserDocContents = {
  [lift in LiftType]: RecordField;
};

export type UserDoc = {
  version: "3";
} & UserDocContents &
  FirestoreField;
