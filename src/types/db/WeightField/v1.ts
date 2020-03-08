import { FirestoreField } from "../marker";
import { WeightUnit } from "../../WeightUnit/v1";

export interface WeightField extends FirestoreField {
  value: number;
  unit: WeightUnit;
  version: "1";
}
