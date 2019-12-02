import * as React from "react";
import firebase from "firebase/app";
import * as t from "./types";
import * as db from "./db";
import { Link } from "react-router-dom";

export default ({
  user,
  liftType
}: {
  user: firebase.User;
  liftType: t.LiftType;
}) => {
  const [lifts, setLifts] = React.useState<{ [date: string]: t.DisplayLift[] }>(
    {}
  );

  React.useEffect(() => {
    const firestore = firebase.firestore();
    const lifts = db
      .getLifts(firestore, user.uid)
      .where("type", "==", liftType)
      .orderBy("date", "desc")
      .limit(50);
    return db.onSnapshotGroupedBy(
      lifts,
      doc =>
        doc
          .data()
          .date.toDate()
          .toISOString()
          .slice(0, 10),
      doc => {
        const data = doc.data();
        const asDate = data.date.toDate();
        data["date"] = asDate;
        data["uid"] = doc.id;
        return data as t.DisplayLift;
      },
      grouping => {
        setLifts(grouping);
      }
    );
  }, [user.uid, liftType]);

  if (Object.keys(lifts).length === 0) {
    return <div>No lifts recorded.</div>;
  }

  const dateGroups: [string, t.DisplayLift[]][] = Object.keys(
    lifts
  ).map(key => [key, lifts[key]]);

  return (
    <>
      {dateGroups.map(([dateString, lifts]: [string, t.DisplayLift[]]) => {
        return (
          <div key={dateString}>
            <div className="title is-5">{dateString}</div>
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Reps</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lifts.map(lift => (
                  <tr key={lift.uid}>
                    <td>{lift.date.toLocaleTimeString()}</td>
                    <td>{lift.weight}</td>
                    <td>{lift.reps}</td>
                    <td>
                      <Link to={`/lift/${lift.uid}/edit`}>Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
};
