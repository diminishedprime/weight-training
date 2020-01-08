import * as React from "react";
import * as t from "../types";
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
  const [daysWithLiftsArray, setDaysWithLiftsArray] = hooks.useLocalStorage<
    string[]
  >(t.LocalStorageKey.DAYS_WITH_LIFTS, []);
  const daysWithLifts = new Set(daysWithLiftsArray);
  React.useEffect(() => {
    if (user === null) {
      return;
    }
    if (daysWithLiftsArray === []) {
      db.getDaysWithLifts(firebase.firestore(), user).then(
        setDaysWithLiftsArray
      );
    }
  }, [user, daysWithLiftsArray]);
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
        tileContent={tile => {
          if (daysWithLifts.has(moment(tile.date).format("YYYY-MM-DD"))) {
            return <>*</>;
          }
          return null;
        }}
        tileClassName={tile => {
          if (daysWithLifts.has(moment(tile.date).format("YYYY-MM-DD"))) {
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
