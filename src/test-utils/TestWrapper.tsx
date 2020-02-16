import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import store from "../store";
import { setFirebase } from "../types";

const mockFirebase: any = {
  auth: () => ({
    onAuthStateChanged(cb: (user: any) => void) {
      cb({ uid: "test-user" });
    }
  })
};

store.dispatch(setFirebase(mockFirebase));

interface TestWrapperProps {
  initialEntries?: string[];
}

const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  initialEntries
}) => {
  return (
    <Provider store={store}>
      <Router initialEntries={initialEntries}>{children}</Router>
    </Provider>
  );
};

export default TestWrapper;
