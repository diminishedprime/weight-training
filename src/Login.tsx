import * as React from "react";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";

type LoginProps = {
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
};

export default ({ setUser }: LoginProps) => {
  const history = useHistory();

  const googleSignIn = React.useCallback(() => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        setUser(result.user);
        history.push("/home");
      })
      .catch(function(e) {
        // I should probably add some error handling here at some point.
        console.error(e);
      });
  }, [history, setUser]);

  return (
    <div>
      <button onClick={googleSignIn} className="button is-link">
        Sign In With Google
      </button>
    </div>
  );
};
