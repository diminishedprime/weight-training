import * as ta from "typesafe-actions";
import * as t from "./types";

export const setUserDoc = ta.createAction(
  "setUserDoc",
  action => (userDoc: t.UserDoc) => action({ userDoc })
);
