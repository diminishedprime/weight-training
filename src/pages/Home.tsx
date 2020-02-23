import * as React from "react";
import * as redux from "react-redux";
import { Link } from "react-router-dom";
import LiftCalendar from "../components/LiftCalendar";
import LiftCard from "../components/LiftCard";
import * as db from "../db";
import * as hooks from "../hooks";
import * as t from "../types";

export default () => {
  hooks.useMeasurePage("Home");
  const user = hooks.useForceSignIn();
  const firestore = hooks.useFirestore();
  const userDoc = t.useSelector(
    (s) => s.localStorage && s.localStorage.userDoc
  );
  const dispatch = redux.useDispatch();

  React.useEffect(() => {
    if (user === null) {
      return;
    }
    db.getUserDocCached(firestore, user).then((userDoc) => {
      if (userDoc !== undefined) {
        dispatch(t.setUserDoc(userDoc));
      }
    });
  }, [user, dispatch, firestore]);

  const { activePrograms } = hooks.useActivePrograms();

  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <>
      {Object.values(activePrograms.programs).length > 0 && (
        <>
          <h3>In-Progress Programs</h3>
          <ul>
            {Object.values(activePrograms.programs).map((program) => {
              return (
                <li key={program.url}>
                  <Link to={program.url}>{program.displayText}</Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <div className="flex flex-wrap">
        {Object.values(t.LiftType)
          // TODO - there should be smarter error detection around routing &
          // creating of these cards.
          .filter((liftType) => liftType !== t.LiftType.CleanAndJerk)
          .map((liftType) => (
            <LiftCard
              liftType={liftType}
              userDoc={userDoc}
              key={`/lift/${liftType}`}
            />
          ))}
      </div>
      <LiftCalendar />
    </>
  );
};
