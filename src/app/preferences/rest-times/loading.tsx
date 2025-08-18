import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants/paths";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Preferences_RestTimes} />
      Loading rest time preferences...
    </React.Fragment>
  );
}
