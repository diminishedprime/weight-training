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

  return (
    <div>
      You're logged in as {user.email}
      <Lifts />
    </div>
  );
};

type Lift = {
  date: Date;
  weight: number;
  lift: "deadlift";
};

const Lifts = () => {
  const [lifts, setLifts] = React.useState<Lift[]>([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection("lifts")
      .get()
      .then(lifts => {
        setLifts(
          lifts.docs
            .slice(0, 5)
            .map(doc => doc.data())
            .map(data => {
              const asDate = data.date.toDate();
              data["date"] = asDate;
              return data as Lift;
            })
        );
      });
  });
  return (
    <div>
      Your recent lifts
      <div>
        {lifts.map((lift, idx) => (
          <div key={idx}>
            <div>Lift: {lift.lift}</div>
            <div>Date: {lift.date.toDateString()}</div>
            <div>Weight: {lift.weight}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
