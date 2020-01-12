import firebase from "firebase/app";
import * as React from "react";
import * as redux from "react-redux";
import LiftCalendar from "../components/LiftCalendar";
import LiftCard from "../components/LiftCard";
import * as db from "../db";
import * as hooks from "../hooks";
import * as t from "../types";

export default () => {
  const user = hooks.useForceSignIn();
  const userDoc = t.useSelector(
    (s) => s.localStorage && s.localStorage.userDoc
  );
  const dispatch = redux.useDispatch();
  React.useEffect(() => {
    if (user === null) {
      return;
    }
    db.getUserDoc(firebase.firestore(), user.uid).then((userDoc) => {
      if (userDoc !== undefined) {
        dispatch(t.setUserDoc(userDoc));
      }
    });
  }, [user, dispatch]);

  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <>
      <div className="flex">
        {Object.values(t.LiftType).map((liftType) => (
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
