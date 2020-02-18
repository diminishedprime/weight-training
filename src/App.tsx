import "firebase/analytics";
import "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "./index.sass";

import store from "./store";
import * as t from "./types";

import React from "react";

import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import CatchError from "./components/CatchError";
import UpdateApp from "./components/UpdateApp";
import Layout from "./Layout";
import EditLift from "./pages/EditLift";
import FourOhFour from "./pages/FourOhFour";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Programs from "./pages/Programs";
import RecordLift from "./pages/RecordLift";
import Records from "./pages/Records";
import Settings from "./pages/Settings";
import ViewLifts from "./pages/ViewLifts";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: (registration: ServiceWorkerRegistration) => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }
});

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/programs">
        <Programs />
      </Route>
      <Route path="/settings" exact>
        <Settings />
      </Route>
      <Route path="/login" exact>
        <Login />
      </Route>
      {Object.values(t.barbellLiftTypes).map((liftType) => {
        return (
          <Route
            key={`/lift/${liftType}`}
            path={[`/lift/${liftType}/:program/:started`, `/lift/${liftType}`]}
          >
            <RecordLift liftType={liftType} />
          </Route>
        );
      })}
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/lift/:liftId/edit" exact>
        <EditLift />
      </Route>
      <Route path="/lifts/:date" exact>
        <ViewLifts />
      </Route>
      <Route path="/records" exact>
        <Records />
      </Route>
      <Route path="/404" exact>
        <FourOhFour />
      </Route>
      <Route>
        <FourOhFour />
      </Route>
    </Switch>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <CatchError>
        <Router>
          <UpdateApp />
          <Layout>
            <Routes />
          </Layout>
        </Router>
      </CatchError>
    </Provider>
  );
};
export default App;
