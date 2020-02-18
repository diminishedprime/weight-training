import * as ta from "typesafe-actions";
import * as t from "./types";

export const setUserDoc = ta.createAction(
  "setUserDoc",
  (action) => (userDoc: t.UserDoc) => action({ userDoc })
);

export const nextForceUpdateLift = ta.createAction(
  "nextForceUpdateLift",
  (action) => () => action({})
);

export const setFirestore = ta.createAction(
  "set-firestore",
  (action) => (firestore: t.Firestore) => action({ firestore })
);

export const setAnalytics = ta.createAction(
  "set-analytics",
  (action) => (analytics: t.Analytics) => action({ analytics })
);

export const setAuth = ta.createAction("set-auth", (action) => (auth: t.Auth) =>
  action({ auth })
);
