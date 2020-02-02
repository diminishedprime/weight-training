import { WeightUnit } from "../../WeightUnit/v1";

export interface WeightField {
  value: number;
  unit: WeightUnit;
  version: "1";
}
