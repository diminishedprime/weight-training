import PagePerform from "@/app/superblocks/[superblock_id]/perform/_components/_page_Perform";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PATHS } from "@/constants";
import { requireLoggedInUser } from "@/serverUtil";
import React, { Suspense } from "react";

interface SuperblocksByIdSuspenseWrapperProps {
  params: Promise<{ superblock_id: string }>;
}

export default async function SuperblocksByIdSuspenseWrapper(
  props: SuperblocksByIdSuspenseWrapperProps,
) {
  const [{ superblock_id: superblockId }, { userId }] = await Promise.all([
    props.params,
    requireLoggedInUser(PATHS.Programs),
  ]);

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={PATHS.Superblocks_Id_Perform(superblockId)}
        truncate={[superblockId]}
        nonLinkable={[superblockId]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PagePerform userId={userId} superblockId={superblockId} />
      </Suspense>
    </React.Fragment>
  );
}
