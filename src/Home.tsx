import * as React from "react";
import firebase from "firebase/app";
import * as hooks from "./hooks";
import LiftTable from "./LiftTable";
import Layout from "./Layout";
import * as t from "./types";
import { Link } from "react-router-dom";

export default () => {
  const user = hooks.useForceSignIn();

  const addRandomLift = React.useCallback(() => {
    if (user === null) {
      return;
    }
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("lifts")
      .add({
        lift: "deadlift",
        weight: Math.floor(Math.random() * 200),
        date: new Date()
      });
  }, [user]);

  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <Layout>
      {Object.values(t.LiftType).map(liftType => {
        return (
          <div>
            <Link to={`/lift/${liftType}`}>
              <button className="button">{liftType}</button>
            </Link>
          </div>
        );
      })}
    </Layout>
  );
};
