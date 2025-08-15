import { RecentSetOverviewsAPI } from "@/app/superblocks/[superblock_id]/edit/_components/AddBlock";
import Overview from "@/app/superblocks/[superblock_id]/edit/_components/Overviews/Overview";
import { ExerciseType, RDispatch, RecentSetOverviews } from "@/common-types";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import { Stack, Typography } from "@mui/material";
import React from "react";

interface OverviewsProps {
  overviews: RecentSetOverviews | undefined;
  exercise: ExerciseType | null;
  api: RecentSetOverviewsAPI;
  setReps: RDispatch<number>;
  setWeight: RDispatch<number | null>;
  setSets: RDispatch<number>;
}

const Overviews: React.FC<OverviewsProps> = (props) => {
  if (props.exercise === null) {
    return null;
  }

  const RecentSetsHelp = (
    <React.Fragment>
      Clicking the button under a recent set will set the target weight & reps
      to that value.
      <br />
      <br />A good rule of thumb is to pick a recent set that didn't have any
      failures. If it was mostly blue & green, you can probalby bump the weight
      up. If there were lots of yellows or red, you may want to lower the
      weight. Otherwise you may just want to keep it the same. It's all vibes.
    </React.Fragment>
  );

  return (
    <LabeledValue label="Recent Sets" help={RecentSetsHelp}>
      <TODO>
        I'm not happy with how this is a quick flash when the network is good. I
        think I may need something like deref in angular that allows for a
        minimum time.
      </TODO>
      {props.api.isMutating ? (
        <Typography variant="caption" color="text.secondary">
          Loading...
        </Typography>
      ) : (
        <Stack
          spacing={0.5}
          direction="row"
          sx={{
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {props.overviews !== undefined && props.overviews.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No recent sets for exercise.
            </Typography>
          ) : (
            props.overviews?.map((overview, idx) => (
              <Overview
                key={idx}
                overview={overview}
                setReps={props.setReps}
                setWeight={props.setWeight}
                setSets={props.setSets}
              />
            ))
          )}
        </Stack>
      )}
    </LabeledValue>
  );
};

export default Overviews;
