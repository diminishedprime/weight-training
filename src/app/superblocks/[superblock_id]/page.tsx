import PageSuperblocksById from "@/app/superblocks/[superblock_id]/_components/_page_SuperblockById";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PATHS } from "@/constants";
import React, { Suspense } from "react";

interface SuperblocksByIdSuspenseWrapperProps {
  params: Promise<{ superblock_id: string }>;
}

export default async function SuperblocksByIdSuspenseWrapper(
  props: SuperblocksByIdSuspenseWrapperProps,
) {
  const { superblock_id: superblockId } = await props.params;

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={PATHS.SuperblocksById(superblockId)}
        truncate={[superblockId]}
        nonLinkable={[superblockId]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PageSuperblocksById superblockId={superblockId} />
      </Suspense>
    </React.Fragment>
  );
}
