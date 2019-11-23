import * as React from "react";
import firebase from "firebase/app";
import * as hooks from "./hooks";
import LiftTable from "./LiftTable";
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
  const [navActive, setNavActive] = React.useState(false);

  const signOut = React.useCallback(() => {
    firebase.auth().signOut();
  }, []);

  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <>
      <nav
        className="navbar is-fixed-top"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io">
            <div className="title">Weight Training</div>
          </a>

          <a
            role="button"
            className={`navbar-burger burger ${navActive && "is-active"}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => {
              setNavActive(old => !old);
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={`navbar-menu ${navActive && "is-active"}`}>
          <div className="navbar-end">
            <div className="navbar-item">
              <a className="button is-primary" onClick={signOut}>
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div>
        <LiftTable liftType={t.LiftType.DEADLIFT} user={user} />
        <button className="button" onClick={addRandomLift}>
          Add random lift
        </button>
      </div>
    </>
  );
};
