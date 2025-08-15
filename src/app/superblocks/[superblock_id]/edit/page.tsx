import AddBlock from "@/app/superblocks/[superblock_id]/edit/_components/AddBlock";
import DeleteBlock from "@/app/superblocks/[superblock_id]/edit/_components/DeleteBlock";
import { GetPerformSuperblockResult } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayWeight from "@/components/display/DisplayWeight";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { TestIds } from "@/test-ids";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
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
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} justifyContent="space-between">
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
        {superblock.blocks.map((block, idx) => (
          <Stack
            key={block.id}
            spacing={1}
            component={Paper}
            sx={{ p: 1 }}
            data-testid={TestIds.Superblocks_SuperblockId_Edit_Block(idx)}
          >
            <Typography variant="h6">{block.name}</Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems={"flex-end"}
            >
              <LabeledValue label="Sets" alignItems={"center"}>
                <Typography>{block.exercises.length}</Typography>
              </LabeledValue>
              <LabeledValue label="Heaviest Set" alignItems={"center"}>
                <DisplayWeight
                  // TODO: easy - we should just have this be a part of the query.
                  weightValue={block.exercises.reduce(
                    (max, exercise) =>
                      Math.max(
                        max,
                        exercise.actual_weight_value ??
                          exercise.target_weight_value,
                      ),
                    0,
                  )}
                  weightUnit={block.exercises[0]?.weight_unit ?? undefined}
                />
              </LabeledValue>
              <LabeledValue label="Total Volume" alignItems={"center"}>
                <DisplayWeight
                  weightValue={block.exercises.reduce(
                    (total, exercise) =>
                      total +
                      (exercise.actual_weight_value ??
                        exercise.target_weight_value),
                    0,
                  )}
                  weightUnit={block.exercises[0]?.weight_unit ?? undefined}
                />
              </LabeledValue>
              <Box flex={1} />
              <DeleteBlock
                userId={userId}
                block={block}
                superblockId={superblockId}
              />
            </Stack>
          </Stack>
        ))}
        <AddBlock userId={userId} superblockId={superblockId} />
      </Stack>
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
