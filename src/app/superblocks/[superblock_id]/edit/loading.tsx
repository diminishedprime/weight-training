import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/skeleton/Button";
import DisplayWeight from "@/components/skeleton/DisplayWeight";
import EditWeight from "@/components/skeleton/EditWeight";
import Icon from "@/components/skeleton/Icon";
import LabeledValue from "@/components/skeleton/LabeledValue";
import SelectExercise from "@/components/skeleton/SelectExercise";
import SelectNumber from "@/components/skeleton/SelectNumber";
import Typography from "@/components/skeleton/Typography";
import { Paths } from "@/constants/paths";
import { Divider, Fab, Paper, Skeleton, Stack } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Superblocks_SuperblockId_Edit("123")}
        truncate={["123"]}
        labels={{ ["123"]: <Typography component="span">Leg Day</Typography> }}
      />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">Leg Day - Edit</Typography>
        <Button>Let's a go</Button>
      </Stack>
      <Stack component={Paper} sx={{ p: 1 }}>
        <Typography variant="h6">Squats</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={"flex-end"}
        >
          <LabeledValue label="Sets" alignItems={"center"}>
            <Typography>1</Typography>
          </LabeledValue>
          <LabeledValue label="Heaviest Set" alignItems={"center"}>
            <DisplayWeight />
          </LabeledValue>
          <LabeledValue label="Total Volume" alignItems={"center"}>
            <DisplayWeight />
          </LabeledValue>
          <Stack flex={1} />
          <Button>
            <Icon />
            Delete
          </Button>
        </Stack>
      </Stack>
      <Stack component={Paper} sx={{ m: 1, p: 1 }}>
        <LabeledValue
          label="Add Block"
          labelVariant="h6"
          labelColor="text.primary"
        >
          <SelectExercise />
          <LabeledValue label="Weight" alignItems="center">
            <EditWeight />
          </LabeledValue>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="space-around"
            width="100%"
          >
            <LabeledValue label="Sets" alignItems="center">
              <SelectNumber />
            </LabeledValue>
            <LabeledValue label="Reps" alignItems="center">
              <SelectNumber />
            </LabeledValue>
          </Stack>
        </LabeledValue>
        <Divider />
        <Stack alignItems="center" sx={{ p: 1, m: 1 }}>
          <Typography variant="h6">Back Squat (Barbell)</Typography>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            <LabeledValue label="Sets" alignItems="center">
              <Typography component="span">5</Typography>
            </LabeledValue>
            <Icon />
            <LabeledValue label="Reps" alignItems="center">
              <Typography component="span">5</Typography>
            </LabeledValue>
            <Icon />
            <LabeledValue label="Weight" alignItems="center">
              <Typography component="span">100</Typography>
            </LabeledValue>
            <Typography component="span" variant="h5">
              =
            </Typography>
            <LabeledValue label="Volume" alignItems="center">
              <Typography component="span">2500</Typography>
            </LabeledValue>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="end">
          <Skeleton>
            <Fab variant="extended">Add Block</Fab>
          </Skeleton>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
