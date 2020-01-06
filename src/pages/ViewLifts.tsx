import * as React from "react";
import * as hooks from "../hooks";
import { useParams, useHistory } from "react-router-dom";
import LiftTable from "../components/LiftTable";
import LiftCalendar from "../components/LiftCalendar";
import moment from "moment";

export default () => {
  const user = hooks.useForceSignIn();
  const { date } = useParams();
  const history = useHistory();

  const parsedDate = moment(date, "YYYY-MM-DD");
  if (!parsedDate.isValid()) {
    history.push("/404");
    return null;
  }
  if (user === null) {
    return <div>Checking login status</div>;
  }

  const startOfDay = moment(date, "YYYY-MM-DD").toDate();
  const endOfDay = moment(date, "YYYY-MM-DD")
    .add(1, "day")
    .toDate();

  return (
    <>
      <LiftCalendar />
      <div className="is-5">{date}</div>
      <LiftTable
        user={user}
        modifyQuery={query =>
          query.where("date", ">", startOfDay).where("date", "<", endOfDay)
        }
      />
    </>
  );
};
