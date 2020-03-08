import firebase from "firebase/app";
import "firebase/firestore";
import * as redux from "redux";
import * as ta from "typesafe-actions";
import * as a from "./actions";
import * as db from "./db";
import * as t from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyBBu2D-owaz14CfZvmOqjSoN0oMde5D5NE",
  authDomain: "weight-training-8a1ac.firebaseapp.com",
  databaseURL: "https://weight-training-8a1ac.firebaseio.com",
  projectId: "weight-training-8a1ac",
  storageBucket: "weight-training-8a1ac.appspot.com",
  messagingSenderId: "21223491336",
  appId: "1:21223491336:web:7378ae65a038e84eda8ebd",
  measurementId: "G-4F9TH5XYE6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const getInitialState = (): t.RootState => {
  // Initialize stuff from localstorage.
  const userDoc = t.UserDoc.fromLocalStorage();

  const firestore = firebase.firestore();
  return {
    db: db.initializedWith(firestore),
    analytics: firebase.analytics && firebase.analytics(),
    auth: firebase.auth && firebase.auth(),
    userDoc,
    forceUpdateLift: 0,
    firestore
  };
};

const rootReducer = ta
  .createReducer(getInitialState())
  .handleAction([a.setWeightTrainingDb], (state, { payload: { db } }) =>
    Object.assign({}, state, { db })
  )
  .handleAction([a.setAuth], (state, { payload: { auth } }) =>
    Object.assign({}, state, { auth })
  )
  .handleAction([a.setAnalytics], (state, { payload: { analytics } }) =>
    Object.assign({}, state, { analytics })
  )
  .handleAction([a.setFirestore], (state, { payload: { firestore } }) =>
    Object.assign({}, state, { firestore })
  )
  .handleAction([a.nextForceUpdateLift], (state) =>
    Object.assign({}, state, { forceUpdateLift: state.forceUpdateLift + 1 })
  )
  .handleAction([a.setUserDoc], (state, { payload: { userDoc } }) => ({
    ...state,
    userDoc
  }));

const saveToLocalStorage: redux.Middleware<{}, t.RootState> = (store) => (
  next
) => (action: t.RootAction) => {
  const result = next(action);
  if (ta.isActionOf(a.setUserDoc, action)) {
    action.payload.userDoc.saveToLocalStorage();
  }
  return result;
};

const store = redux.createStore(
  rootReducer,
  redux.applyMiddleware(saveToLocalStorage)
);

export default store;
