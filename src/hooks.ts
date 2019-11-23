import * as firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import * as React from "react";

export const useForceSignIn = () => {
  const history = useHistory();
  const [user, setUser] = React.useState<firebase.User | null>(null);
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      if (!user) {
        history.push("/login");
      }
    });
  }, [history]);
  return user;
};
