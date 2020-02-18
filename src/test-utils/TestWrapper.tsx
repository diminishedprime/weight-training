import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import store from "../store";
import { Auth, Firestore, setAuth, setFirestore } from "../types";

interface Initializations {
  localApp?: Firestore;
  auth?: Auth;
}

interface TestWrapperProps {
  initialEntries?: string[];
}

export const initalizeTestWrapper: (
  cb: () => JSX.Element,
  props?: TestWrapperProps & Initializations
) => React.FC<TestWrapperProps> = (cb, props) => {
  const { localApp, auth, ...testWrapperProps } = props || {};
  if (auth !== undefined) {
    store.dispatch(setAuth(auth));
  } else {
    store.dispatch(
      setAuth({
        onAuthStateChanged(cb: (user: any) => void) {
          cb({ uid: "test-user" });
        }
      } as any)
    );
  }
  if (localApp !== undefined) {
    store.dispatch(setFirestore(localApp));
  }
  if (auth !== undefined) {
    store.dispatch(setAuth(auth));
  }

  const TestWrapper: React.FC<TestWrapperProps> = ({ initialEntries }) => {
    return (
      <Provider store={store}>
        <Router initialEntries={initialEntries}>{cb()}</Router>
      </Provider>
    );
  };
  return () => <TestWrapper {...testWrapperProps} />;
};
