import Breadcrumbs from "@/components/Breadcrumbs";
import { PATHS } from "@/constants";
import React, { Suspense } from "react";

interface SuperblocksByIdSuspenseWrapperProps {
  params: Promise<{ superblock_id: string }>;
}

export default async function SuperblocksByIdSuspenseWrapper(
  props: SuperblocksByIdSuspenseWrapperProps,
) {
  const { superblock_id } = await props.params;

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={PATHS.SuperblocksById(superblock_id)}
        truncate={[superblock_id]}
        nonLinkable={[superblock_id]}
      />
      <Suspense fallback={<div>Loading...</div>}>TODO!</Suspense>
    </React.Fragment>
  );
}
