import { FirestoreField } from "../marker";

export interface TimeStampField extends FirestoreField {
  seconds: number;
  nanoseconds: number;
}
