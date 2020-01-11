import firebase from "firebase/app";
import moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import * as db from "../db";
import * as hooks from "../hooks";
import * as t from "../types";

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

interface LiftTableProps {
  modifyQuery: (query: firebase.firestore.Query) => firebase.firestore.Query;
  user: t.User;
}

const LiftTable: React.FC<LiftTableProps> = ({ modifyQuery, user }) => {
  const [lifts, setLifts] = React.useState<t.DisplayLift[]>([]);
  const [editing, setEditing] = React.useState<string>();
  const forceUpdate = t.useSelector((a) => a.forceUpdateLift);

  React.useEffect(() => {
    db.lifts(firebase.firestore(), user, modifyQuery).then(setLifts);
  }, [user, modifyQuery, forceUpdate]);

  if (lifts.length === 0) {
    return <div>No lifts recorded.</div>;
  }

  const seenDates = new Set();

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
                  setEditing((old) => (old === lift.uid ? undefined : lift.uid))
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
export default LiftTable;
