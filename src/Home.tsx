import * as React from "react";
import * as hooks from "./hooks";
import firebase from "firebase/app";
import Layout from "./Layout";
import * as t from "./types";
import { Link } from "react-router-dom";
import * as db from "./db";

export default () => {
  const user = hooks.useForceSignIn();
  const [prs, setPrs] = React.useState<t.UserDoc | undefined>();
  console.log({ prs });
  React.useEffect(() => {
    if (user === null) {
      return;
    }
    db.getUserDoc(firebase.firestore(), user.uid).then(userDoc => {
      setPrs(userDoc);
    });
  }, [user]);

  if (user === null) {
    return <div>Checking login status</div>;
  }

  return (
    <Layout>
      <div className="flex">
        {Object.values(t.LiftType).map(liftType => {
          return (
            <Link
              key={`/lift/${liftType}`}
              to={`/lift/${liftType}`}
              className="card lift-card flex-column flex-center"
            >
              <figure className="card-svg">
                <img src={t.liftSvgMap[liftType]} width="50" alt="" />
              </figure>
              <div className="">{liftType}</div>
              {prs && prs[liftType] && prs[liftType]![t.ONE_REP_MAX] && (
                <div>
                  PR:{" "}
                  <span className="bold">{prs[liftType]![t.ONE_REP_MAX]}</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </Layout>
  );
};
