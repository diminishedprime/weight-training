"use server";

import PreferencesPage from "@/app/preferences/_page";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import React, { Suspense } from "react";

export default async function SuspenseWrapper() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Preferences} />
      <Suspense fallback={<div>Loading preferences...</div>}>
        <PreferencesPage />
      </Suspense>
    </React.Fragment>
  );
}
