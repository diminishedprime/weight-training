import * as React from "react";
import firebase from "firebase/app";
import Calendar from "react-calendar";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import * as db from "../db";
import * as hooks from "../hooks";

export default () => {
  const history = useHistory();
  const user = hooks.useForceSignIn();
  const { date: dateUrlParam } = useParams();
  const [daysWithLifts, setDaysWithLifts] = React.useState<Set<string>>(
    new Set()
  );
  const [visibleDate, setVisibleDate] = React.useState(() => {
    return dateUrlParam === undefined
      ? moment()
      : moment(dateUrlParam, "YYYY-MM-DD");
  });
  const [date] = React.useState(() => {
    return dateUrlParam === undefined
      ? moment().toDate()
      : moment(dateUrlParam, "YYYY-MM-DD").toDate();
  });

  React.useEffect(() => {
    if (user === null) {
      return () => {};
    }
    // TODO - this can do 7 days less and more and it we can show days from adjacent months.
    const week = moment.duration(7, "days");
    const startOfMonth = moment(visibleDate)
      .startOf("month")
      .subtract(week)
      .toDate();
    const endOfMonth = moment(visibleDate)
      .endOf("month")
      .add(week)
      .toDate();

    console.log({ startOfMonth, endOfMonth });

    db.getDaysWithLiftsBetween(
      firebase.firestore(),
      user.uid,
      startOfMonth,
      endOfMonth
    ).then(setDaysWithLifts);
  }, [dateUrlParam, user, visibleDate]);

  return (
    <div className="home-calendar card lift-card">
      <div>Lift Calendar</div>
      <Calendar
        onActiveDateChange={view => {
          setVisibleDate(moment(view.activeStartDate));
        }}
        calendarType="US"
        value={date}
        tileContent={tile => {
          const day = moment(tile.date).format("YYYY-MM-DD");
          if (daysWithLifts.has(day)) {
            return <>*</>;
          }
          return null;
        }}
        tileClassName={tile => {
          const day = moment(tile.date).format("YYYY-MM-DD");
          if (daysWithLifts.has(day)) {
            return "bold";
          }
          return null;
        }}
        onChange={date => {
          if (date instanceof Array) {
            return;
          }
          const urlDate = moment(date).format("YYYY-MM-DD");
          history.push(`/lifts/${urlDate}`);
        }}
      />
    </div>
  );
};
