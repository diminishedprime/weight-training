import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants/paths";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Programs_Add} />
      Loading add programs...
    </React.Fragment>
  );
}
