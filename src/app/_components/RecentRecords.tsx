import { HydrateHomeRecentRecord } from "@/common-types";
import DisplayEquipmentThumbnail from "@/components/display/DisplayEquipmentThumbnail";
import DisplayTimeSince from "@/components/display/DisplayTimeSince";
import DisplayWeight from "@/components/display/DisplayWeight";
import Link from "@/components/Link";
import { Paths } from "@/constants";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import StarIcon from "@mui/icons-material/Star";
import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

interface Props {
  records: HydrateHomeRecentRecord[];
}

const RecentRecords: React.FC<Props> = (props) => {
  return (
    <React.Fragment>
      <Typography variant="body1">Recent Personal Records</Typography>
      <Stack
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gridTemplateRows="repeat(2, 1fr)"
        gap={1}
      >
        {props.records.map((record) => (
          <Stack key={record.id} component={Paper} p={1} flex={1}>
            <Stack direction="row" justifyContent="space-between">
              <StarIcon color={"warning"} fontSize="small" />
              <Stack direction="row" spacing={0.5}>
                <Typography
                  display="flex"
                  gap={0.5}
                  flexDirection="row"
                  component={Link}
                  underline="hover"
                  href={Paths.PersonalRecords_ExerciseType(
                    record.exercise_type,
                  )}
                >
                  {exerciseTypeUIStringBrief(record.exercise_type)}
                </Typography>
              </Stack>
              <StarIcon color={"warning"} fontSize="small" />
            </Stack>
            <Stack alignSelf="center">
              <DisplayEquipmentThumbnail
                equipmentType={record.equipment_type}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-between" flex={1}>
              <Stack direction="row" alignItems="center">
                <DisplayWeight
                  weightValue={record.value}
                  weightUnit="pounds"
                  reps={record.reps}
                />
              </Stack>
              <DisplayTimeSince date={new Date(record.recorded_at)} addSuffix />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </React.Fragment>
  );
};

export default RecentRecords;
