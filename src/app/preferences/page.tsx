"use server";

import PreferencesPage from "@/app/preferences/_page";
import Breadcrumbs from "@/components/Breadcrumbs";
import React, { Suspense } from "react";

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
