import * as t from "../../../types";
import { LiftDocTypes, migrate } from "./migrate";

export * from "./v3";

export const toLift: t.FromFirestore<t.Lift> = (o: object): t.Lift => {
  const latest = migrate(o as LiftDocTypes);
  return t.Lift.fromDb(latest);
};
