import * as React from "react";
import firebase from "firebase/app";
import * as hooks from "./hooks";
import * as t from "./types";

export default ({
  user,
  liftType
}: {
  user: firebase.User;
  liftType: t.LiftType;
}) => {
  const [lifts, setLifts] = React.useState<t.Lift[]>([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("lifts")
      .where("lift", "==", liftType)
      .orderBy("date", "desc")
      .limit(5)
      .onSnapshot(snapshot => {
        setLifts(
          snapshot.docs.map(doc => {
            const data = doc.data();
            const asDate = data.date.toDate();
            data["date"] = asDate;
            data["uid"] = doc.id;
            return data as t.Lift;
          })
        );
      });
  }, [user.uid]);
  return (
    <table className="table is-striped">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {lifts.map(lift => (
          <tr key={lift.uid}>
            <td>{lift.date.toLocaleTimeString()}</td>
            <td>{lift.weight}</td>
            <td>
              <button className="button link is-danger">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
