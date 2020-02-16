import * as t from "../../../types";
import { LiftDoc as V1 } from "./v1";
import { LiftDoc as V2, LiftDocType } from "./v2";
import { LiftDoc as V3 } from "./v3";
import { migrate, LiftDoc } from "./migrate";
export * from "./v2";

export const toLift: t.FromFirestore<t.Lift> = (o: object): t.Lift => {
  const latest = migrate(o as LiftDoc);
  return t.Lift.fromDb(latest);
};
