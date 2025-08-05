"use client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants/paths";
import { usePathname } from "next/navigation";
import React from "react";

// I wish this didn't have to be a client component, but I don't know how else
// to get the superblock_id, since Loading doesn't have access to them.
export default function Loading() {
  const path = usePathname();
  const parts = path.split("/");
  const [_root, _superblocks, superblockId, _edit] = parts;
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Superblocks_SuperblockId_Edit(superblockId)}
        truncate={[superblockId]}
      />
      Loading superblock...
    </React.Fragment>
  );
}
