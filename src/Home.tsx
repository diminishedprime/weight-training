import * as React from "react";
import * as hooks from "./hooks";
import Layout from "./Layout";
import * as t from "./types";
import { Link } from "react-router-dom";

export default () => {
  const user = hooks.useForceSignIn();

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
              className="card lift-card"
            >
              <div className="card-content">{liftType}</div>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
};
