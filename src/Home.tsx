import * as React from "react";
import firebase from "firebase/app";
import * as hooks from "./hooks";
import LiftTable from "./LiftTable";
import Layout from "./Layout";
import * as t from "./types";

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
      <LiftTable liftType={t.LiftType.DEADLIFT} user={user} />
      <button className="button" onClick={addRandomLift}>
        Add random lift
      </button>
    </Layout>
  );
};
