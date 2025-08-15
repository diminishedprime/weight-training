import Exercise from "@/app/superblocks/[superblock_id]/edit/_components/Overviews/Exercise";
import { RDispatch, RecentSetOverview } from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import LabeledValue from "@/components/LabeledValue";
import { Button, Stack } from "@mui/material";
import { useCallback, useMemo } from "react";

interface OverviewProps {
  overview: RecentSetOverview;
  setReps: RDispatch<number>;
  setWeight: RDispatch<number | null>;
  setSets: RDispatch<number>;
}

const Overview: React.FC<OverviewProps> = (props) => {
  const api = useOverviewAPI(props);
  return (
    <LabeledValue
      alignItems={"center"}
      label={
        <DisplayDate
          variant="body1"
          timestamp={props.overview.started_at}
          twoDigitYear
          noTime
        />
      }
    >
      <Stack
        spacing={1}
        useFlexGap
        height="100%"
        justifyContent="space-between"
      >
        <Stack spacing={1}>
          {props.overview.exercises.map((exercise) => (
            <Exercise key={exercise.id} exercise={exercise} />
          ))}
        </Stack>
        <Stack spacing={1}>
          <LabeledValue label="Volume" alignItems="center">
            {api.totalVolume}
          </LabeledValue>
          <Button variant="outlined" onClick={api.onClick}>
            {api.buttonText}
          </Button>
        </Stack>
      </Stack>
    </LabeledValue>
  );
};
export default Overview;

const useOverviewAPI = (props: OverviewProps) => {
  const {
    overview: { median_weight, median_reps, exercises },
    setReps,
    setWeight,
    setSets,
  } = props;
  const onClick = useCallback(() => {
    if (
      median_weight === null ||
      median_reps === null ||
      exercises === null ||
      exercises.length === 0
    ) {
      return;
    }
    setReps(median_reps);
    setWeight(median_weight);
    setSets(exercises.length);
  }, [median_weight, median_reps, exercises, setReps, setSets, setWeight]);

  const buttonText = useMemo(
    () => `${median_weight}×${median_reps}×${exercises.length}`,
    [exercises, median_weight, median_reps],
  );

  const totalVolume = useMemo(() => {
    return exercises.reduce((acc, exercise) => {
      return acc + exercise.weight * exercise.reps;
    }, 0);
  }, [exercises]);

  return { onClick, buttonText, totalVolume };
};
