import PagePerform from "@/app/superblocks/[superblock_id]/perform/_components/_page_Perform";
import { GetPerformSuperblockResult } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PATHS } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import React, { Suspense } from "react";

interface SuperblocksByIdSuspenseWrapperProps {
  params: Promise<{ superblock_id: string }>;
}

export default async function SuperblocksByIdSuspenseWrapper(
  props: SuperblocksByIdSuspenseWrapperProps,
) {
  const { superblock_id: superblockId } = await props.params;
  const { userId } = await requireLoggedInUser(
    PATHS.Superblocks_Id_Perform(superblockId),
  );
  const superblock = await getPerformSuperblock(userId, superblockId);

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={PATHS.Superblocks_Id_Perform(superblockId)}
        labels={{
          [superblockId]: superblock.name,
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PagePerform userId={userId} superblock={superblock} />
      </Suspense>
    </React.Fragment>
  );
}

const getPerformSuperblock = async (userId: string, superblockId: string) => {
  const superblock = await supabaseRPC("get_perform_superblock", {
    p_user_id: userId,
    p_superblock_id: superblockId,
  });
  return superblock as GetPerformSuperblockResult;
};
