import classNames from "classnames";
import moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import * as c from "../constants";
import * as db from "../db";
import * as hooks from "../hooks";
import * as t from "../types";

interface TimeSinceProps {
  user: t.FirebaseUser;
  liftUid: string;
  time: t.FirestoreTimestamp;
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
  modifyQuery: (query: t.Query) => t.Query;
  user: t.FirebaseUser;
  showType?: boolean;
}

const LiftTable: React.FC<LiftTableProps> = ({
  modifyQuery,
  user,
  showType
}) => {
  const {
    settings: { unit }
  } = hooks.useSettings();
  const [lifts, setLifts] = React.useState<t.DisplayLift[]>([]);
  const [editing, setEditing] = React.useState<string>();
  const userDoc = t.useSelector((a) => a.localStorage.userDoc);
  const forceUpdate = t.useSelector((a) => a.forceUpdateLift);
  const firestore = hooks.useFirestore();

  React.useEffect(() => {
    db.lifts(firestore, user, modifyQuery).then(setLifts);
  }, [user, modifyQuery, forceUpdate, firestore]);

  if (lifts.length === 0) {
    return <div>No lifts recorded.</div>;
  }

  const seenDates = new Set();

  return (
    <table className="table is-striped is-fullwidth">
      <tbody>
        {lifts.map((lift, liftIdx) => {
          const date = lift
            .getDate()
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
                  {showType && <th>Type</th>}
                  <th>Time</th>
                  <th>Weight</th>
                  <th>Reps</th>
                  <th>Warmup</th>
                </tr>
              </>
            );
            seenDates.add(date);
          }
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
                {showType && (
                  <td>{c.liftMetadata[lift.getType()].displayText}</td>
                )}

                {liftIdx === 0 ? (
                  <td>
                    <TimeSince
                      liftUid={lift.uid}
                      user={user}
                      time={lift.getDate()}
                    />
                  </td>
                ) : (
                  <td>{moment(lift.getDate().toDate()).format("HH:mm")}</td>
                )}
                <td
                  className={classNames({
                    "has-text-primary":
                      userDoc &&
                      userDoc
                        .getORM(lift.getType())
                        .weight.equals(lift.getWeight())
                  })}
                >
                  {lift.getWeight().display(unit)}
                </td>
                <td>{lift.getReps()}</td>
                <td align="center">{lift.getWarmup() ? "✔️" : ""}</td>
              </tr>
              {editing === lift.uid && (
                <tr>
                  <td colSpan={5}>
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
