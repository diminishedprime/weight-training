import firebase from "firebase/app";
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

export const setFirebase = ta.createAction(
  "set-firebase",
  (action) => (f: typeof firebase) => action({ firebase: f })
);

export const setFirestore = ta.createAction(
  "set-firestore",
  (action) => (firestore: firebase.firestore.Firestore) => action({ firestore })
);

export const setAnalytics = ta.createAction(
  "set-analytics",
  (action) => (analytics: firebase.analytics.Analytics) => action({ analytics })
);
