import * as React from "react";
import * as hooks from "../hooks";
import { useParams, Link } from "react-router-dom";
import * as t from "../types";
import * as db from "../db";
import firebase from "firebase/app";
import moment from "moment";

export default () => {
  const user = hooks.useForceSignIn();
  const { date } = useParams();
  const [lifts, setLifts] = React.useState<undefined | t.DisplayLift[]>(
    undefined
  );

  React.useEffect(() => {
    if (user === null) {
      return;
    }
    const duration = moment.duration({ days: 1 });
    const dayBefore = moment(date, "YYYY-MM-DD")
      .subtract(duration)
      .toDate();
    const dayAfter = moment(date, "YYYY-MM-DD")
      .add(duration)
      .toDate();

    db.getLiftsBetween(
      firebase.firestore(),
      user.uid,
      dayBefore,
      dayAfter
    ).then(setLifts);
  }, [date]);

  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <>
      <div className="is-5">{date}</div>
      {lifts === undefined ? (
        <div>Loading...</div>
      ) : (
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Reps</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lifts.map(lift => (
              <tr key={lift.uid}>
                <td>{moment(lift.date).format("hh:mm a")}</td>
                <td>{lift.type}</td>
                <td>{lift.weight}</td>
                <td>{lift.reps}</td>
                <td>
                  <Link to={`/lift/${lift.uid}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
