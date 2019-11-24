import * as React from "react";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import Layout from "./Layout";

export default () => {
  const history = useHistory();

  const googleSignIn = React.useCallback(() => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function() {
        history.push("/");
      })
      .catch(function(e) {
        // I should probably add some error handling here at some point.
        console.error(e);
      });
  }, [history]);

  return (
    <Layout>
      <div>
        <button onClick={googleSignIn} className="button is-link">
          Sign In With Google
        </button>
      </div>
    </Layout>
  );
};
