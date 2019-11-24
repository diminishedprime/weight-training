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
      {Object.values(t.LiftType).map(liftType => {
        return (
          <div key={`/lift/${liftType}`}>
            <Link to={`/lift/${liftType}`}>
              <button className="button">{liftType}</button>
            </Link>
          </div>
        );
      })}
    </Layout>
  );
};
