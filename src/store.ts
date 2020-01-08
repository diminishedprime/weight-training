import * as redux from "redux";
import * as ta from "typesafe-actions";
import * as t from "./types";
import * as a from "./actions";

const getInitialState = (): t.RootState => {
  let localStorage = {};
  const fromStorage = window.localStorage.getItem("@mjh/weight-training");
  if (fromStorage !== null) {
    localStorage = JSON.parse(fromStorage);
  }
  return { localStorage, forceUpdateLift: 0 };
};

const rootReducer = ta
  .createReducer(getInitialState())
  .handleAction([a.nextForceUpdateLift], state =>
    Object.assign({}, state, { forceUpdateLift: state.forceUpdateLift + 1 })
  )
  .handleAction([a.setUserDoc], (state, { payload: { userDoc } }) =>
    Object.assign({}, state, { localStorage: { userDoc } })
  );

const saveToLocalStorage: redux.Middleware<{}, t.RootState> = store => next => (
  action: t.RootAction
) => {
  let result = next(action);
  if (ta.isActionOf(a.setUserDoc, action)) {
    new Promise(resolve => {
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
