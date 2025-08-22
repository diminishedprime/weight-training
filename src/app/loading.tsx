import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/skeleton/Button";
import DisplayWeight from "@/components/skeleton/DisplayWeight";
import Icon from "@/components/skeleton/Icon";
import LabeledValue from "@/components/skeleton/LabeledValue";
import Typography from "@/components/skeleton/Typography";
import { Paths } from "@/constants";
import { Paper, Skeleton, Stack } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Home} />
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        sx={{ "& > *": { flex: "1 0 auto" } }}
      >
        <Skeleton variant="rounded" width="120px" height="32px" />
        <Skeleton variant="rounded" width="120px" height="32px" />
        <Skeleton variant="rounded" width="120px" height="32px" />
        <Skeleton variant="rounded" width="120px" height="32px" />
        <Skeleton variant="rounded" width="120px" height="32px" />
      </Stack>
      <Typography variant="h6">For You</Typography>
      <Stack direction="row">
        <Button>Current Program</Button>
      </Stack>

      <Typography variant="body1">Powerlifting Stats</Typography>
      <PowerliftingStat />
      <PowerliftingStat />
      <RecentRecords />
      <RecentSuperblock />
    </React.Fragment>
  );
}

const PowerliftingStat: React.FC = () => {
  return (
    <Stack component={Paper} sx={{ p: 1 }}>
      <Stack direction="row">
        <Typography variant="h6">Label</Typography>
      </Stack>
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Lift label="Deadlift" />
          <Icon />
          <Lift label="Squat" />
          <Icon />
          <Lift label="Bench" />
          <Icon />
          <Stack spacing={0} alignItems="center">
            <Typography variant="h6">Total</Typography>
            <DisplayWeight />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

interface LiftProp {
  label: string;
}

const Lift: React.FC<LiftProp> = (props) => {
  return (
    <LabeledValue
      label={props.label}
      labelVariant="caption"
      alignItems="center"
    >
      <Stack alignItems="center" spacing={0}>
        <Typography variant="caption">12/06/21</Typography>
        <Typography>225 lbs</Typography>
      </Stack>
    </LabeledValue>
  );
};

const RecentRecords: React.FC = () => {
  return (
    <React.Fragment>
      <Typography variant="body1">Recent Personal Records</Typography>
      <Stack
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gridTemplateRows="repeat(2, 1fr)"
        gap={1}
      >
        <Record />
        <Record />
        <Record />
        <Record />
      </Stack>
    </React.Fragment>
  );
};

const Record: React.FC = () => {
  return (
    <Stack component={Paper} p={1} flex={1}>
      <Stack direction="row" justifyContent="space-between">
        <Icon />
        <Stack direction="row" spacing={0.5}>
          <Typography>Deadlift</Typography>
        </Stack>
        <Icon />
      </Stack>
      <Stack alignSelf="center">
        <Icon />
      </Stack>
      <Stack direction="row" justifyContent="space-between" flex={1}>
        <Stack direction="row" alignItems="center">
          <DisplayWeight />
        </Stack>
        <Typography>5 days ago</Typography>
      </Stack>
    </Stack>
  );
};

const RecentSuperblock: React.FC = () => {
  return (
    <React.Fragment>
      <Typography variant="body1">Recent Superblocks</Typography>
      <Stack display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
        <Superblock />
        <Superblock />
      </Stack>
    </React.Fragment>
  );
};

const Superblock: React.FC = () => {
  return (
    <Stack component={Paper} p={1} spacing={0}>
      <Typography display="flex" gap={1} alignItems="center" variant="h6">
        Pull Day
        <Typography variant="body2">12/12/25</Typography>
      </Typography>
      <Stack direction="row" flexWrap="wrap" justifyContent="space-around">
        <LabeledValue label="Volume" alignItems="center">
          <Typography>25,585 lbs</Typography>
        </LabeledValue>
        <LabeledValue label="Sets" alignItems="center">
          <Typography>32</Typography>
        </LabeledValue>
      </Stack>
    </Stack>
  );
};
