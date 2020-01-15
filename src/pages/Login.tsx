import firebase from "firebase/app";
import * as React from "react";
import { useHistory } from "react-router-dom";
import * as hooks from "../hooks";

export default () => {
  hooks.useMeasurePage("Login");
  const history = useHistory();

  const googleSignIn = React.useCallback(() => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        history.push("/");
      })
      .catch((e) => {
        // I should probably add some error handling here at some point.
        console.error(e);
      });
  }, [history]);

  return (
    <div>
      <button onClick={googleSignIn} className="button is-link">
        Sign In With Google
      </button>
    </div>
  );
};
