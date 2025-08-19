import { ExerciseType } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/skeleton/Button";
import DisplayDate from "@/components/skeleton/DisplayDate";
import DisplayWeight from "@/components/skeleton/DisplayWeight";
import DisplayWeightChange from "@/components/skeleton/DisplayWeightChange";
import LabeledValue from "@/components/skeleton/LabeledValue";
import Pagination from "@/components/skeleton/Pagination";
import Typography from "@/components/skeleton/Typography";
import { Paths } from "@/constants/paths";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { Paper, Stack } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Programs} />
      <Button sx={{ alignSelf: "center" }}>New Program</Button>
      <Pagination />
      <ProgramOverview />
      <ProgramOverview />
      <ProgramOverview />
      <ProgramOverview />
      <Pagination />
    </React.Fragment>
  );
}

function ProgramOverview() {
  return (
    <Stack component={Paper} sx={{ m: 1, p: 1 }}>
      <Stack>
        <Typography variant="h6">Program Name</Typography>
        <Stack direction="row" alignItems={"center"}>
          <DisplayDate />
          <Typography>-</Typography>
          <DisplayDate />
        </Stack>
        <Typography variant="body2" color="textSecondary">
          Program Notes
        </Typography>
      </Stack>
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={0}
        justifyContent="space-between"
      >
        {(
          [
            "barbell_back_squat",
            "barbell_back_squat",
            "barbell_back_squat",
            "barbell_back_squat",
          ] as ExerciseType[]
        ).map((exerciseType, idx) => (
          <LabeledValue
            key={idx}
            label={exerciseTypeUIStringBrief(exerciseType)}
            alignItems="center"
          >
            <Stack>
              <DisplayWeight />
              <LabeledValue label="Change" alignItems={"center"}>
                <DisplayWeightChange />
              </LabeledValue>
            </Stack>
          </LabeledValue>
        ))}
      </Stack>
    </Stack>
  );
}
