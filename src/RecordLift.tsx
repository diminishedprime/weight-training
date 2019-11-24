import * as React from "react";
import * as hooks from "./hooks";
import LiftTable from "./LiftTable";
import Layout from "./Layout";
import * as t from "./types";

type RecordLiftProps = {
  liftType: t.LiftType;
};

export default ({ liftType }: RecordLiftProps) => {
  const user = hooks.useForceSignIn();
  if (user === null) {
    return null;
  }
  return (
    <Layout>
      <LiftTable liftType={liftType} user={user} />
    </Layout>
  );
};
