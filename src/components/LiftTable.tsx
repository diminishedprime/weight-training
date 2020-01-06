import * as React from "react";
import firebase from "firebase/app";
import * as t from "../types";
import * as db from "../db";
import { Link } from "react-router-dom";
import moment from "moment";

const TimeSince = ({ time }: { time: Date }) => {
  const [displayTime, setDisplayTime] = React.useState(
    moment(time).format("HH:MM")
  );
  const [timeClass, setTimeClass] = React.useState("");
  React.useEffect(() => {
    const timeUtcMoment = moment(time.toUTCString());
    const interval = setInterval(() => {
      const timeSinceLift = moment.duration(
        moment.utc().diff(timeUtcMoment, "milliseconds"),
        "milliseconds"
      );
      const minutes = timeSinceLift.minutes();
      if (minutes >= 15 || timeSinceLift.asMinutes() >= 15) {
        setDisplayTime(moment(time).format("HH:MM"));
        setTimeClass("");
        clearInterval(interval);
        return;
      }
      if (minutes < 2) {
        setTimeClass(old => {
          if (old !== "has-text-danger") {
            return "has-text-danger";
          } else {
            return old;
          }
        });
      } else {
        setTimeClass(old => {
          return old === "has-text-success" ? old : "has-text-success";
        });
      }
      const seconds = timeSinceLift.seconds();
      setDisplayTime(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 500);
    return () => clearInterval(interval);
  }, [time]);

  return <span className={timeClass}>{displayTime}</span>;
};

export default ({ user, liftType }: { user: t.User; liftType: t.LiftType }) => {
  const [lifts, setLifts] = React.useState<{ [date: string]: t.DisplayLift[] }>(
    {}
  );
  const [allLifts, setAllLifts] = React.useState<t.DisplayLift[]>([]);

  React.useEffect(() => {
    return db.getLiftsOnSnapshot(
      firebase.firestore(),
      user,
      query => query.where("type", "==", liftType).orderBy("date", "desc"),
      lifts => {
        setAllLifts(lifts);
        const grouped = lifts.reduce((grouping, lift) => {
          const liftKey = lift.date.toLocaleDateString().slice(0, 10);
          if (grouping[liftKey] === undefined) {
            grouping[liftKey] = [];
          }
          grouping[liftKey].push(lift);
          return grouping;
        }, {} as { [date: string]: t.DisplayLift[] });
        setLifts(grouped);
      }
    );
  }, [user, liftType]);

  if (Object.keys(lifts).length === 0) {
    return <div>No lifts recorded.</div>;
  }

  const dateGroups: [string, t.DisplayLift[]][] = Object.keys(
    lifts
  ).map(key => [key, lifts[key]]);

  let seenDates = new Set();

  return (
    <>
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
          {allLifts.map((lift, liftIdx) => {
            const date = lift.date.toLocaleDateString().substring(0, 10);
            let headingRow;
            if (!seenDates.has(date)) {
              headingRow = (
                <tr>
                  <td
                    align="center"
                    colSpan={4}
                    className="bold has-background-primary"
                  >
                    {date}
                  </td>
                </tr>
              );
              seenDates.add(date);
            }
            return (
              <React.Fragment key={lift.uid}>
                {headingRow && headingRow}
                <tr key={lift.uid}>
                  {liftIdx === 0 ? (
                    <td>
                      <TimeSince time={lift.date} />
                    </td>
                  ) : (
                    <td>{moment(lift.date).format("HH:mm")}</td>
                  )}
                  <td>{lift.weight}</td>
                  <td>{lift.reps}</td>
                  <td>
                    <Link to={`/lift/${lift.uid}/edit`}>Edit</Link>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {dateGroups.map(
        ([dateString, lifts]: [string, t.DisplayLift[]], groupIdx) => {
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
                  {lifts.map((lift, liftIdx) => (
                    <tr key={lift.uid}>
                      {liftIdx === 0 && groupIdx === 0 ? (
                        <td>
                          <TimeSince time={lift.date} />
                        </td>
                      ) : (
                        <td>{lift.date.toLocaleTimeString()}</td>
                      )}
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
        }
      )}
    </>
  );
};
