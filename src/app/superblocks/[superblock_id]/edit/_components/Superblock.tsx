"use client";

import AddBlock from "@/app/superblocks/[superblock_id]/edit/_components/AddBlock";
import DeleteBlock from "@/app/superblocks/[superblock_id]/edit/_components/DeleteBlock";
import { GetPerformSuperblockResult } from "@/common-types";
import DisplayWeight from "@/components/display/DisplayWeight";
import LabeledValue from "@/components/LabeledValue";
import Notify, { Notification } from "@/components/Notify";
import { LOADING_SX } from "@/constants";
import { TestIds } from "@/test/test-ids";
import { Paper, Stack, Typography } from "@mui/material";
import { Set as ImmutableSet } from "immutable";
import React, { useState } from "react";

interface Props {
  hydratedSuperblockResult: GetPerformSuperblockResult;
  userId: string;
}

const Superblock: React.FC<Props> = (props) => {
  const api = useSuperblockApi(props);
  return (
    <React.Fragment>
      {api.superblock.blocks.map((block, idx) => (
        <Stack
          key={block.id}
          component={Paper}
          sx={{ p: 1, ...LOADING_SX(api.deletingBlocks.has(block.id)) }}
          data-testid={TestIds.Superblocks_SuperblockId_Edit_Block(idx)}
        >
          <Typography variant="h6">{block.name}</Typography>
          <Stack
            direction="row"
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
            <Stack flex={1} />
            <DeleteBlock
              userId={props.userId}
              block={block}
              superblockId={api.superblock.id}
              setDeleting={api.setDeletingBlocks}
              setSuperblock={api.setSuperblock}
            />
          </Stack>
        </Stack>
      ))}
      <AddBlock
        userId={props.userId}
        superblockId={api.superblock.id}
        setSuperblock={api.setSuperblock}
        setNotifications={api.setNotifications}
      />
      <Notify
        setNotifications={api.setNotifications}
        notifications={api.notifactions}
      />
    </React.Fragment>
  );
};

export default Superblock;

const useSuperblockApi = (props: Props) => {
  const { hydratedSuperblockResult } = props;

  const [superblock, setSuperblock] = useState(hydratedSuperblockResult);
  const [deletingBlocks, setDeletingBlocks] = useState(ImmutableSet<string>());
  const [notifactions, setNotifications] = useState<Notification[]>([]);

  return {
    superblock,
    setSuperblock,
    deletingBlocks,
    setDeletingBlocks,
    notifactions,
    setNotifications,
  };
};
