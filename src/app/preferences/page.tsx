"use server";

import { requireLoggedInUser } from "@/serverUtil";
import React, { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Typography } from "@mui/material";

const PreferencesPage = async () => {
  await requireLoggedInUser("/preferences");
  return (
    <Typography>
      This is where the user preferences will eventually be managed.
    </Typography>
  );
};

export default async function SuspenseWrapper() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname="/preferences" />
      <Suspense fallback={<div>Loading preferences...</div>}>
        <PreferencesPage />
      </Suspense>
    </React.Fragment>
  );
}
