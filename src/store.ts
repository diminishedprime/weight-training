import * as redux from "redux";
import * as ta from "typesafe-actions";
import * as a from "./actions";
import * as t from "./types";

const getInitialState = (): t.RootState => {
  let localStorage = {};
  const fromStorage = window.localStorage.getItem("@mjh/weight-training");
  if (fromStorage !== null) {
    localStorage = JSON.parse(fromStorage);
    const userDoc = (localStorage as any).userDoc as t.UserDoc;
    if (userDoc !== undefined) {
      Object.values(userDoc).forEach((value) => {
        const orm = value![t.ONE_REP_MAX];
        if (orm !== undefined) {
          value![t.ONE_REP_MAX] = new t.Weight(orm.value, orm.unit);
        }
      });
    }
  }
  return { localStorage, forceUpdateLift: 0 };
};

const rootReducer = ta
  .createReducer(getInitialState())
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
