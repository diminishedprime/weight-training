"use server";

import React, { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PreferencesPage from "@/app/preferences/_page";

// TODO: when the user goes to /preferences from the top bar, we should keep
// track of which page we were on so we can navigate back.
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
