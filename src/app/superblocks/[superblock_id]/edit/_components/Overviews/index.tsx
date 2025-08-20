import Overview from "@/app/superblocks/[superblock_id]/edit/_components/Overviews/Overview";
import {
  ExerciseType,
  RDispatch,
  RecentSetOverviewsResult,
} from "@/common-types";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import { useRPCMutation } from "@/hooks";
import { Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

interface OverviewsProps {
  userId: string;
  exerciseType: ExerciseType | null;
  setReps: RDispatch<number | null>;
  setWeight: RDispatch<number | null>;
  setSets: RDispatch<number | null>;
  setOverviewsLoading: RDispatch<boolean>;
}

const Overviews: React.FC<OverviewsProps> = (props) => {
  const api = useOverviewsAPI(props);

  if (props.exerciseType === null) {
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
      <Stack
        spacing={0.5}
        direction="row"
        sx={{
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {api.overviews?.overviews !== undefined &&
        api.overviews?.overviews?.length === 0 ? (
          <Typography variant="caption" color="text.secondary">
            No recent sets for exercise.
          </Typography>
        ) : (
          api.overviews?.overviews?.map((overview, idx) => (
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
    </LabeledValue>
  );
};

export default Overviews;

const useOverviewsAPI = (props: OverviewsProps) => {
  const {
    exerciseType,
    userId,
    setReps,
    setSets,
    setWeight,
    setOverviewsLoading,
  } = props;

  const [overviews, setOverviews] = useState<RecentSetOverviewsResult>();

  const { trigger: recentSetOverviews, isMutating } = useRPCMutation(
    "recent_set_overviews",
    useCallback(
      (e: Error) => `Error fetching recent set overviews: ${e.message}`,
      [],
    ),
    undefined,
    setOverviews,
  );

  useEffect(() => {
    setOverviewsLoading(isMutating);
  }, [isMutating, setOverviewsLoading]);

  const updateOverviews = useCallback(async () => {
    if (exerciseType === null) {
      return;
    }
    await recentSetOverviews({
      p_exercise_type: exerciseType,
      p_user_id: userId,
    });
  }, [exerciseType, recentSetOverviews, userId]);

  useEffect(() => {
    if (exerciseType === null) {
      setOverviews(undefined);
      setReps(null);
      setSets(null);
      setWeight(null);
      return;
    }
    updateOverviews();
  }, [exerciseType, updateOverviews, setReps, setSets, setWeight]);

  return { isMutating, overviews };
};
