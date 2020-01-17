import firebase from "firebase/app";
import * as React from "react";
import { useHistory } from "react-router-dom";
import * as hooks from "../hooks";

export default () => {
  hooks.useMeasurePage("Login");
  const history = useHistory();
  const [error, setError] = React.useState();

  const googleSignIn = React.useCallback(() => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        history.push("/");
      })
      .catch((e) => {
        setError(e);
      });
  }, [history]);

  return (
    <div>
      {error && (
        <div>There was an error logging in: {JSON.stringify(error)}</div>
      )}
      <p>Log in with Google to use this application.</p>
      <button onClick={googleSignIn} className="button is-link">
        Sign In With Google
      </button>
    </div>
  );
};
