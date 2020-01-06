import * as React from "react";
import firebase from "firebase/app";
import * as t from "../types";
import * as db from "../db";
import { Link } from "react-router-dom";
import moment from "moment";
import * as hooks from "../hooks";

interface TimeSinceProps {
  user: t.User;
  liftUid: string;
  time: t.Timestamp;
}

const TimeSince: React.FC<TimeSinceProps> = ({ liftUid, user, time }) => {
  const { className, displayString } = hooks.useTimeSinceLift(user, liftUid);
  return (
    <span className={className}>
      {displayString || moment(time.toDate()).format("HH:mm")}
    </span>
  );
};

export default ({ user, liftType }: { user: t.User; liftType: t.LiftType }) => {
  const [lifts, setLifts] = React.useState<t.DisplayLift[]>([]);
  const [editing, setEditing] = React.useState<string>();

  React.useEffect(() => {
    return db.getLiftsOnSnapshot(
      firebase.firestore(),
      user,
      query => query.where("type", "==", liftType).orderBy("date", "desc"),
      setLifts
    );
  }, [user, liftType]);

  if (lifts.length === 0) {
    return <div>No lifts recorded.</div>;
  }

  let seenDates = new Set();

  return (
    <table className="table is-striped is-fullwidth">
      <tbody>
        {lifts.map((lift, liftIdx) => {
          const date = lift.date
            .toDate()
            .toLocaleDateString()
            .substring(0, 10);
          let headingRow;
          if (!seenDates.has(date)) {
            headingRow = (
              <>
                <tr>
                  <td
                    align="center"
                    colSpan={5}
                    className="bold has-background-primary"
                  >
                    {date}
                  </td>
                </tr>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Reps</th>
                  <th>Warmup</th>
                </tr>
              </>
            );
            seenDates.add(date);
          }
          // TODO - make edit show up as a colSpan 4 after you tap a cell
          return (
            <React.Fragment key={lift.uid}>
              {headingRow && headingRow}
              <tr
                key={lift.uid}
                onClick={() =>
                  setEditing(old => (old === lift.uid ? undefined : lift.uid))
                }
                className={editing === lift.uid ? "is-selected" : undefined}
              >
                {liftIdx === 0 ? (
                  <td>
                    <TimeSince
                      liftUid={lift.uid}
                      user={user}
                      time={lift.date}
                    />
                  </td>
                ) : (
                  <td>{moment(lift.date.toDate()).format("HH:mm")}</td>
                )}
                <td>{lift.weight}</td>
                <td>{lift.reps}</td>
                <td align="center">{lift.warmup ? "✔️" : ""}</td>
              </tr>
              {editing === lift.uid && (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-end">
                      <Link to={`/lift/${lift.uid}/edit`}>Edit</Link>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};
