import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import store from "../store";
import { Firebase, Firestore, setFirebase, setFirestore } from "../types";

const mockFirebase: any = {
  auth: () => ({
    onAuthStateChanged(cb: (user: any) => void) {
      cb({ uid: "test-user" });
    }
  })
};

interface Initializations {
  localApp?: Firestore;
  firebase?: Firebase;
}

interface TestWrapperProps {
  initialEntries?: string[];
}

export const initalizeTestWrapper: (
  cb: () => JSX.Element,
  props?: TestWrapperProps & Initializations
) => React.FC<TestWrapperProps> = (cb, props) => {
  const { localApp, firebase, ...testWrapperProps } = props || {};
  if (firebase === undefined) {
    store.dispatch(setFirebase(mockFirebase));
  } else {
    store.dispatch(setFirebase(firebase));
  }
  if (localApp !== undefined) {
    store.dispatch(setFirestore(localApp));
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
