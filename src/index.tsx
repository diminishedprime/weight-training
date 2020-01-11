import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import store from "./store";
import { Provider } from "react-redux";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import "./index.sass";
import Login from "./pages/Login";
import Home from "./pages/Home";
import * as t from "./types";
import UpdateApp from "./components/UpdateApp";
import RecordLift from "./pages/RecordLift";
import EditLift from "./pages/EditLift";
import ViewLifts from "./pages/ViewLifts";
import FourOhFour from "./pages/FourOhFour";

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

const App: React.FC = () => {
  return (
    <Router>
      <UpdateApp />
      <Layout>
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          {Object.values(t.LiftType).map(liftType => {
            return (
              <Route
                key={`/lift/${liftType}`}
                path={[
                  `/lift/${liftType}/:program/:started`,
                  `/lift/${liftType}`
                ]}
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
          <Route path="/404" exact>
            <FourOhFour />
          </Route>
          <Route>
            <FourOhFour />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
