"use server";

import React, { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PreferencesPage from "@/app/preferences/_page";

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
