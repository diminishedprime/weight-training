import * as React from "react";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";

type HomeProps = {
  user: firebase.User | null;
};

export default ({ user }: HomeProps) => {
  const history = useHistory();

  React.useEffect(() => {
    if (user === null) {
      history.push("/");
    }
  }, [user, history]);

  if (user === null) {
    return <div>Not logged in. You will be redirected.</div>;
  }

  return <div>You're logged in as {user.email}!</div>;
};
