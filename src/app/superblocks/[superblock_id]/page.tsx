import PageSuperblocksById from "@/app/superblocks/[superblock_id]/_components/_page_SuperblockById";
import { NarrowedSuperblock } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PATHS } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { notFoundIfNull } from "@/util";
import React, { Suspense } from "react";

interface SuperblocksByIdSuspenseWrapperProps {
  params: Promise<{ superblock_id: string }>;
}

export default async function SuperblocksByIdSuspenseWrapper(
  props: SuperblocksByIdSuspenseWrapperProps,
) {
  const { superblock_id: superblockId } = await props.params;

  const { userId } = await requireLoggedInUser(
    PATHS.SuperblocksById(superblockId),
  );

  const superblock = await getSuperblock(userId, superblockId);

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={PATHS.SuperblocksById(superblockId)}
        labels={{
          [superblockId]: superblock.name,
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PageSuperblocksById userId={userId} superblock={superblock} />
      </Suspense>
    </React.Fragment>
  );
}

const getSuperblock = async (userId: string, superblockId: string) => {
  const result = await supabaseRPC("get_superblock", {
    p_user_id: userId,
    p_superblock_id: superblockId,
  });
  notFoundIfNull(result.id);
  return result as NarrowedSuperblock;
};
