import { WeightUnit } from "../../WeightUnit/v1";
import { FirestoreField } from "../marker";

export interface WeightField extends FirestoreField {
  value: number;
  unit: WeightUnit;
  version: "1";
}
