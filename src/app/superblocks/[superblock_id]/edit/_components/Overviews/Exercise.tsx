import { RecentSetOverviewExercise } from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import { DisplayPerceivedEffort } from "@/components/display/DisplayPerceivedEffort";
import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";

interface ExerciseProps {
  exercise: RecentSetOverviewExercise;
}

const Exercise: React.FC<ExerciseProps> = (props) => {
  const api = useExerciseAPI(props);
  return (
    <Stack direction="row" justifyContent={"space-between"} spacing={0.5}>
      <DisplayCompletionStatus
        fontSize={"small"}
        completionStatus={props.exercise.completion_status}
      />
      <Typography variant="caption">
        {props.exercise.weight}x{props.exercise.reps}
      </Typography>
      <Stack
        sx={{
          visibility: api.perceivedEffortVisibility,
        }}
      >
        <DisplayPerceivedEffort
          fontSize={"small"}
          perceivedEffort={props.exercise.perceived_effort}
        />
      </Stack>
    </Stack>
  );
};

export default Exercise;

const useExerciseAPI = (props: ExerciseProps) => {
  const {
    exercise: { completion_status },
  } = props;
  const perceivedEffortVisibility = useMemo(() => {
    if (completion_status === "skipped") {
      return "hidden";
    }
    if (completion_status === "not_started") {
      return "hidden";
    }
    return "visible";
  }, [completion_status]);

  return { perceivedEffortVisibility };
};
