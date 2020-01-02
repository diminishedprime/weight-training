import * as React from "react";
import * as hooks from "../hooks";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import LiftCalendar from "../components/LiftCalendar";

export default () => {
  const user = hooks.useForceSignIn();
  const { date } = useParams();

  const lifts = hooks.useLiftsWithCache(user, date);

  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <>
      <LiftCalendar />
      <div className="is-5">{date}</div>
      {lifts === undefined ? (
        <div>Loading...</div>
      ) : lifts.length === 0 ? (
        <div>No lifts for this date</div>
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
