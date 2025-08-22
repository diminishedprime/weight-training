import {
  HydratedHomePowerliftingTotal,
  HydrateHomePowerlifting,
} from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayWeight from "@/components/display/DisplayWeight";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import AddIcon from "@mui/icons-material/Add";
import EqualsIcon from "@mui/icons-material/Menu";
import StarIcon from "@mui/icons-material/Star";
import { Paper, Stack, Typography } from "@mui/material";
import { amber, blueGrey, yellow } from "@mui/material/colors";
import React from "react";

interface Props {
  powerlifting: HydrateHomePowerlifting;
}

const PowerliftingStats: React.FC<Props> = (props) => {
  return (
    <React.Fragment>
      <Typography variant="body1">Powerlifting Stats</Typography>
      <PowerLiftingTotal
        label="All Time"
        liftingTotal={props.powerlifting.record}
      />
      <PowerLiftingTotal
        label="Recent"
        liftingTotal={props.powerlifting.recent}
      />
    </React.Fragment>
  );
};

export default PowerliftingStats;

interface PowerliftingTotalProps {
  label: string;
  liftingTotal: HydratedHomePowerliftingTotal;
}

const PowerLiftingTotal: React.FC<PowerliftingTotalProps> = (props) => {
  return (
    <Stack component={Paper} sx={{ p: 1 }}>
      <Stack direction="row">
        <Typography variant="h6">{props.label}</Typography>
        <Stack flex={1} />
        {props.liftingTotal.total_weight >= 500 && (
          <LabeledValue label="500" alignItems="center">
            <StarIcon sx={{ color: amber[700] }} />
          </LabeledValue>
        )}
        {props.liftingTotal.total_weight >= 750 && (
          <LabeledValue label="750" alignItems="center">
            <StarIcon sx={{ color: blueGrey[500] }} />
          </LabeledValue>
        )}
        {props.liftingTotal.total_weight >= 1000 && (
          <LabeledValue label="1000" alignItems="center">
            <StarIcon sx={{ color: yellow[500] }} />
          </LabeledValue>
        )}
      </Stack>
      <Stack>
        <Stack
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
        >
          <RecentLift
            label="Deadlift"
            weight={props.liftingTotal.deadlift_weight}
            time={props.liftingTotal.deadlift_time}
          />
          <AddIcon fontSize="medium" />
          <RecentLift
            label="Squat"
            weight={props.liftingTotal.squat_weight}
            time={props.liftingTotal.squat_time}
          />
          <AddIcon fontSize="medium" />
          <RecentLift
            label="Bench"
            weight={props.liftingTotal.bench_press_weight}
            time={props.liftingTotal.bench_press_time}
          />
          <EqualsIcon fontSize="medium" />
          <Stack spacing={0} alignItems="center">
            <Typography variant="h6">Total</Typography>
            <DisplayWeight
              weightValue={props.liftingTotal.total_weight}
              weightUnit="pounds"
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

interface RecentLiftProps {
  label: string;
  weight: number | null;
  time: string | null;
}

const RecentLift: React.FC<RecentLiftProps> = (props) => {
  return (
    <LabeledValue
      label={props.label}
      labelVariant="caption"
      alignItems="center"
    >
      <TODO>
        It'd be nice to also include % of body weight here too if the user
        provided it since that's a fun vanity stat to try and min/max.
      </TODO>
      <Stack alignItems="center" spacing={0}>
        {props.weight === null ? (
          <Typography>No recent 1-rep max squats</Typography>
        ) : (
          <React.Fragment>
            {props.time && (
              <DisplayDate
                timestamp={props.time}
                dateColor="textPrimary"
                twoDigitYear
                noTime
                variant="caption"
              />
            )}
            <DisplayWeight weightValue={props.weight} weightUnit="pounds" />
          </React.Fragment>
        )}
      </Stack>
    </LabeledValue>
  );
};
