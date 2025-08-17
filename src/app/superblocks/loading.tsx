import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants/paths";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Programs} />
      Loading superblocks...
    </React.Fragment>
  );
}
