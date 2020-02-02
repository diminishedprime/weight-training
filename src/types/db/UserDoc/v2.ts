import * as t from "../../../types";
import { RecordField } from "../RecordField/v2";

type UserDocContents = {
  [lift in t.LiftType]: RecordField;
};

export type UserDoc = {
  version: "2";
} & UserDocContents;
