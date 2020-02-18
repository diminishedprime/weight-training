import moment from "moment";
import * as React from "react";
import Calendar from "react-calendar";
import { useHistory, useParams } from "react-router-dom";
import * as db from "../db";
import * as hooks from "../hooks";

export default () => {
  const history = useHistory();
  const user = hooks.useForceSignIn();
  const { date: dateUrlParam } = useParams();
  const [daysWithLifts, setDaysWithLifts] = React.useState<Set<string>>(
    new Set()
  );
  const firestore = hooks.useFirestore();
  React.useEffect(() => {
    if (user === null) {
      return;
    }
    db.getDaysWithLifts(firestore, user).then((dwl) =>
      setDaysWithLifts(
        new Set(dwl.data.map((day) => day.local().format("YYYY-MM-DD")))
      )
    );
  }, [user, firestore]);
  const [date] = React.useState(() => {
    return dateUrlParam === undefined
      ? moment().toDate()
      : moment(dateUrlParam, "YYYY-MM-DD").toDate();
  });

  return (
    <div className="home-calendar card lift-card">
      <div>Lift Calendar</div>
      <Calendar
        calendarType="US"
        value={date}
        tileContent={(tile) => {
          if (daysWithLifts.has(moment.utc(tile.date).format("YYYY-MM-DD"))) {
            return <>*</>;
          }
          return null;
        }}
        tileClassName={(tile) => {
          if (daysWithLifts.has(moment.utc(tile.date).format("YYYY-MM-DD"))) {
            return "bold";
          }
          return null;
        }}
        onChange={(date) => {
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
