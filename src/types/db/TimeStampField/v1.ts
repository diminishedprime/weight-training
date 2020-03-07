import { FirestoreField } from "../index";

export interface TimeStampField extends FirestoreField {
  seconds: number;
  nanoseconds: number;
}
