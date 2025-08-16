import { ProgramCycles } from "@/common-types";
import { LinearProgress, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

interface Props {
  cycles: ProgramCycles;
}

const Progress: React.FC<Props> = (props) => {
  const api = useProgressAPI(props);
  return (
    <Stack spacing={1}>
      <LinearProgress variant="determinate" value={api.progress} />
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ justifySelf: "end" }}
      >
        {api.total}/{api.possible} complete
      </Typography>
    </Stack>
  );
};

export default Progress;

const useProgressAPI = (props: Props) => {
  const { cycles } = props;
  return useMemo(() => {
    const allMovements = cycles.flatMap((cycle) => cycle.movements);
    const possible = allMovements.length;
    const total = allMovements.reduce((acc, movement) => {
      if (movement.started_at !== null) acc += 0.5;
      if (movement.completed_at !== null) acc += 0.5;
      return acc;
    }, 0);
    const progress = (total / possible) * 100;
    return { progress, total, possible };
  }, [cycles]);
};
