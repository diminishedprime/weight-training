import {
  NarrowedSuperblock,
  RequiredNonNullable,
  SuperblocksRow,
} from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import DisplayWeight from "@/components/display/DisplayWeight";
import { PATHS } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { notFoundIfNull } from "@/util";
import { Box, Stack, Typography } from "@mui/material";

interface PageSuperblocksByIdProps {
  superblockId: string;
}

export default async function PageSuperblocksById(
  props: PageSuperblocksByIdProps,
) {
  const { superblockId } = props;
  const { userId } = await requireLoggedInUser(
    PATHS.SuperblocksById(superblockId),
  );
  const superblock = await getSuperblock(userId, superblockId);
  return (
    <Stack spacing={1}>
      <Typography variant="h5" display="flex" alignItems={"center"} gap={1}>
        {superblock.name || "Superblock"}
        {superblock.started_at && (
          <DisplayDate timestamp={superblock.started_at} noTime />
        )}
      </Typography>

      <Stack direction="row" spacing={1} justifyContent="space-between">
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
          <Stack key={block.id} spacing={1}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <DisplayEquipmentThumbnail equipmentType={block.equipment_type} />
              {block.name} ({exerciseTypeUIStringBrief(block.exercise_type)})
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              {block.started_at && block.completed_at && (
                <DisplayDuration
                  squiggle
                  from={new Date(block.started_at)}
                  to={new Date(block.completed_at)}
                />
              )}
              <Typography variant="caption">{block.notes}</Typography>
            </Stack>
            {block.wendler_details && (
              <Stack spacing={1}>
                <Typography component="span">
                  Target Max:{" "}
                  <DisplayWeight
                    weightValue={block.wendler_details.training_max_value}
                    weightUnit={block.wendler_details.weight_unit}
                  />
                </Typography>
              </Stack>
            )}
            <Stack spacing={1}>
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
    </Stack>
  );
}

// lmao, at least the autocomplete works.
export type NarrowedSuperblocksRow = RequiredNonNullable<
  Omit<SuperblocksRow, "block_details"> & {
    block_details: RequiredNonNullable<
      NonNullable<SuperblocksRow["block_details"]>[number],
      "id" | "exercise_type"
    >[];
  },
  | "id"
  | "user_id"
  | "started_at"
  | "completed_at"
  | "block_details"
  | "training_volume"
>;

const getSuperblock = async (userId: string, superblockId: string) => {
  const result = await supabaseRPC("get_superblock", {
    p_user_id: userId,
    p_superblock_id: superblockId,
  });
  notFoundIfNull(result.id);
  return result as NarrowedSuperblock;
};
