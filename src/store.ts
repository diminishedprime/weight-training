import firebase from "firebase/app";
import "firebase/firestore";
import * as redux from "redux";
import * as ta from "typesafe-actions";
import * as a from "./actions";
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
  let localStorage = {};
  const fromStorage = window.localStorage.getItem("@mjh/weight-training");
  if (fromStorage !== null) {
    localStorage = JSON.parse(fromStorage);
    const o = (localStorage as any).userDoc;
    if (o !== undefined) {
      (localStorage as any).userDoc = t.UserDoc.fromJSON(JSON.stringify(o));
    }
  }
  return {
    // TODO - put in the same hack for firebase.auth(),
    // This is a hack to make testing work, but in practice this object should always be defined.
    analytics: firebase.analytics && firebase.analytics(),
    localStorage,
    forceUpdateLift: 0,
    firebase,
    firestore: firebase.firestore()
  };
};

const rootReducer = ta
  .createReducer(getInitialState())
  .handleAction([a.setAnalytics], (state, { payload: { analytics } }) =>
    Object.assign({}, state, { analytics })
  )
  .handleAction([a.setFirestore], (state, { payload: { firestore } }) =>
    Object.assign({}, state, { firestore })
  )
  .handleAction([a.setFirebase], (state, { payload: { firebase } }) =>
    Object.assign({}, state, { firebase })
  )
  .handleAction([a.nextForceUpdateLift], (state) =>
    Object.assign({}, state, { forceUpdateLift: state.forceUpdateLift + 1 })
  )
  .handleAction([a.setUserDoc], (state, { payload: { userDoc } }) =>
    Object.assign({}, state, { localStorage: { userDoc } })
  );

const saveToLocalStorage: redux.Middleware<{}, t.RootState> = (store) => (
  next
) => (action: t.RootAction) => {
  const result = next(action);
  if (ta.isActionOf(a.setUserDoc, action)) {
    // This seems like it's probably a bug in tslint, but this is a simple
    // enough fix.
    // tslint:disable-next-line:no-unused-expression
    new Promise((resolve) => {
      const localStorageString = JSON.stringify(store.getState().localStorage);
      window.localStorage.setItem("@mjh/weight-training", localStorageString);
      resolve();
    });
  }
  return result;
};

const store = redux.createStore(
  rootReducer,
  redux.applyMiddleware(saveToLocalStorage)
);

export default store;
