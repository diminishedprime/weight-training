import { NarrowedSuperblock } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import DisplayWeight from "@/components/display/DisplayWeight";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { notFoundIfNull } from "@/util";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

interface Props {
  params: Promise<{ superblock_id: string }>;
}

export default async function Superblocks_SuperblockId(props: Props) {
  const { superblock_id: superblockId } = await props.params;

  const { userId } = await requireLoggedInUser(
    Paths.Superblocks_SuperblockId(superblockId),
  );

  const superblock = await getSuperblock(userId, superblockId);

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Superblocks_SuperblockId(superblockId)}
        labels={{
          [superblockId]: superblock.name,
        }}
      />
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="h5" display="flex" alignItems={"center"} gap={1}>
            <DisplayCompletionStatus
              completionStatus={superblock.completion_status}
            />
            {superblock.name}
            <IconButton
              component={Link}
              href={Paths.Superblocks_SuperblockId_Edit(superblock.id)}
            >
              <EditIcon />
            </IconButton>
          </Typography>
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

        {superblock.started_at && (
          <DisplayDate timestamp={superblock.started_at} noTime />
        )}
        <Stack direction="row" justifyContent="space-between">
          {superblock.started_at && superblock.completed_at && (
            <DisplayDuration
              from={new Date(superblock.started_at)}
              to={new Date(superblock.completed_at)}
            />
          )}
          <Typography variant="caption">{superblock.notes}</Typography>
        </Stack>
        <Stack spacing={3}>
          {superblock.blocks.map((block) => (
            <Stack key={block.id}>
              <Typography
                variant="h6"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <DisplayEquipmentThumbnail
                  equipmentType={block.equipment_type}
                />
                {block.name}
              </Typography>
              <Stack direction="row">
                <LabeledValue label="Exercise">
                  {exerciseTypeUIStringBrief(block.exercise_type)}
                </LabeledValue>
                {block.wendler_details && (
                  <React.Fragment>
                    <LabeledValue label="Target Max">
                      <DisplayWeight
                        weightValue={block.wendler_details.training_max_value}
                        weightUnit={block.wendler_details.weight_unit}
                      />
                    </LabeledValue>
                    <LabeledValue label="Change">
                      <DisplayWeight
                        weightValue={
                          block.wendler_details.increase_amount_value
                        }
                        weightUnit={block.wendler_details.weight_unit}
                      />
                    </LabeledValue>
                  </React.Fragment>
                )}
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                {block.started_at && block.completed_at && (
                  <DisplayDuration
                    squiggle
                    from={new Date(block.started_at)}
                    to={new Date(block.completed_at)}
                  />
                )}
                <Typography variant="caption">{block.notes}</Typography>
              </Stack>
              <Stack>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr",
                    alignItems: "center",
                    gap: 1, // MUI spacing unit
                    width: "100%",
                  }}
                >
                  <Stack>
                    <Typography variant="subtitle2">Date</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle2">Rest time</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle2">Weight</Typography>
                  </Stack>
                </Box>
                {block.exercises.map((exercise) => (
                  <Box
                    key={exercise.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 2fr",
                      alignItems: "center",
                      gap: 1, // MUI spacing unit
                      width: "100%",
                    }}
                  >
                    <Stack>
                      {exercise.performed_at ? (
                        <DisplayDate timestamp={exercise.performed_at} noDate />
                      ) : null}
                    </Stack>
                    <Stack>
                      {exercise.performed_at && exercise.next_performed_at ? (
                        <DisplayDuration
                          from={new Date(exercise.performed_at)}
                          to={new Date(exercise.next_performed_at)}
                          highResolution
                          // TODO: hard-coding for now, but should pull from user
                          // settings (or maybe come from the RPC?)
                          restTimeSeconds={120}
                        />
                      ) : null}
                    </Stack>
                    <Stack>
                      <DisplayWeight
                        weightValue={
                          exercise.actual_weight_value ??
                          exercise.target_weight_value
                        }
                        weightUnit={exercise.weight_unit}
                        reps={exercise.reps}
                        repsAMRAP={exercise.is_amrap}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
        <TODO>
          Clean up this preview to be card based like the other parts of the ui.
        </TODO>
      </Stack>
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
