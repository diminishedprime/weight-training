import { LiftType } from "../LiftType/v2";
import { FirestoreField } from "../marker";
import { RecordField } from "../RecordField/v2";

type UserDocContents = {
  [lift in LiftType]: RecordField;
};

export type UserDoc = {
  version: "3";
} & UserDocContents &
  FirestoreField;
