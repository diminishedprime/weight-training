import moment from "moment";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";
import LiftCalendar from "../components/LiftCalendar";
import LiftTable from "../components/LiftTable";
import * as hooks from "../hooks";

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
      <LiftTable
        user={user}
        modifyQuery={(query) =>
          query.where("date", ">", startOfDay).where("date", "<", endOfDay)
        }
      />
    </>
  );
};
