import * as t from "../../../types";
import { LiftDoc as V1 } from "./v1";
import { LiftDoc as V2, LiftDocType } from "./v2";
import { LiftDoc as V3 } from "./v3";
import { migrate, LiftDocTypes } from "./migrate";

export * from "./v3";

export const toLift: t.FromFirestore<t.Lift> = (o: object): t.Lift => {
  const latest = migrate(o as LiftDocTypes);
  return t.Lift.fromDb(latest);
};
