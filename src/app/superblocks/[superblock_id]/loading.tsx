"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants/paths";
import { Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";

export default function Loading() {
  const path = usePathname();
  const parts = path.split("/");
  const [_root, _superblocks, superblockId] = parts;
  // TODO: for some reason, the breadcrumbs or something has layout shift here
  // which is kinda annoying. Can't be arsed to figure it out right now, though.
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Superblocks_SuperblockId(superblockId)}
        truncate={[superblockId]}
      />
      <Typography>Loading superblock...</Typography>
    </React.Fragment>
  );
}
