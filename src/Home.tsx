import * as React from "react";
import firebase from "firebase/app";
import * as hooks from "./hooks";

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
      .add({ lift: "deadlift", weight: Math.random() * 200, date: new Date() });
  }, [user]);

  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <div>
      You're logged in as {user.email}
      <Lifts user={user} />
      <button className="button" onClick={addRandomLift}>
        Add random lift
      </button>
    </div>
  );
};

type Lift = {
  uid: string;
  date: Date;
  weight: number;
  lift: "deadlift";
};

const Lifts = ({ user }: { user: firebase.User }) => {
  const [lifts, setLifts] = React.useState<Lift[]>([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("lifts")
      .orderBy("date", "desc")
      .limit(5)
      .onSnapshot(snapshot => {
        setLifts(
          snapshot.docs.map(doc => {
            const data = doc.data();
            const asDate = data.date.toDate();
            data["date"] = asDate;
            data["uid"] = doc.id;
            return data as Lift;
          })
        );
      });
  }, []);
  return (
    <div>
      Your recent lifts
      <div>
        {lifts.map((lift, idx) => (
          <div key={idx}>
            <div>Lift: {lift.lift}</div>
            <div>Date: {lift.date.toDateString()}</div>
            <div>Weight: {lift.weight}</div>
            <div>Uid: {lift.uid}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
