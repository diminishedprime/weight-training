import Superblock from "@/app/superblocks/[superblock_id]/edit/_components/Superblock";
import { GetPerformSuperblockResult } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "@/components/Link";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { Button, Stack, Typography } from "@mui/material";
import React from "react";

interface EditProps {
  params: Promise<{ superblock_id: string }>;
}

export default async function Edit(props: EditProps) {
  const { superblock_id: superblockId } = await props.params;
  const path = Paths.Superblocks_SuperblockId_Edit(superblockId);
  const { userId } = await requireLoggedInUser(path);
  // TODO: I think this RPC may just be sufficient, but I may want to create a
  // separate one eventually anyway so we don't get constrained.
  const superblock = await getPerformSuperblock(userId, superblockId);

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={path}
        labels={{ [superblockId]: superblock.name }}
      />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">{superblock.name} - Edit</Typography>
        <Button
          component={Link}
          variant="contained"
          color="primary"
          href={Paths.Superblocks_SuperblockId_Perform(superblock.id)}
          sx={{ justifySelf: "flex-end" }}
        >
          Let's a go
        </Button>
      </Stack>
      <Superblock hydratedSuperblockResult={superblock} userId={userId} />
      <TODO>
        Make blocks re-orderable, even though you can already do them in any
        order.
      </TODO>
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
