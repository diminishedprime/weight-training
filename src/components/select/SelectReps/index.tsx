import { TestIds } from "@/test-ids";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import React, { useMemo } from "react";

export interface SelectRepsProps {
  reps: number;
  setReps: React.Dispatch<React.SetStateAction<number>>;
  repChoices?: number[];
  wendler5s?: boolean;
  wendler3s?: boolean;
  wendler1s?: boolean;
  isAMRAP?: boolean;
  setIsAMRAP?: React.Dispatch<React.SetStateAction<boolean>>;
  hideAMRAP?: boolean;
  hideSettings?: boolean;
}

const DEFAULT_REP_CHOICES = [1, 3, 5, 8, 10, 12, 15];

const SelectReps: React.FC<SelectRepsProps> = (props) => {
  const api = useSelectRepsAPI(props);

  return (
    <FormControl>
      <FormLabel
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "center",
        }}
      >
        <Typography variant="inherit">Reps: {props.reps}</Typography>
        {props.isAMRAP && (
          <Typography variant="inherit" color="secondary" component="span">
            (AMRAP)
          </Typography>
        )}
      </FormLabel>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {!props.hideAMRAP && props.setIsAMRAP && (
          <ToggleButtonGroup
            color="secondary"
            value={props.isAMRAP}
            exclusive
            onChange={() => {
              props.setIsAMRAP?.((old) => !old);
            }}
            size="small"
            aria-label="toggle AMRAP"
          >
            <ToggleButton
              size="small"
              value={true}
              aria-label="toggle AMRAP"
              data-testid={TestIds.SelectRepsAMRAPToggle}
            >
              AMRAP
            </ToggleButton>
          </ToggleButtonGroup>
        )}
        <ToggleButtonGroup
          color="primary"
          value={props.reps}
          exclusive
          onChange={api.handleToggleChange}
          size="small"
          aria-label="Select Reps"
        >
          <ToggleButton
            data-testid={TestIds.RepsDownButton}
            value="-"
            disabled={api.isDecrementDisabled}
            aria-label="decrement reps"
            size="small"
          >
            -
          </ToggleButton>
          {api.choices.map((val) => (
            <ToggleButton
              key={val}
              value={val}
              aria-label={`reps ${val}`}
              size="small"
            >
              {val}
            </ToggleButton>
          ))}
          <ToggleButton
            data-testid={TestIds.RepsUpButton}
            value="+"
            aria-label="increment reps"
            size="small"
          >
            +
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </FormControl>
  );
};

export default SelectReps;

const useSelectRepsAPI = (props: SelectRepsProps) => {
  const { reps, setReps, repChoices, wendler5s, wendler3s, wendler1s } = props;

  const MIN_REPS = 1;
  const [localRepChoices, setLocalRepChoices] = React.useState<number[]>(
    repChoices ||
      (wendler5s
        ? [4, 5, 6, 7, 8]
        : wendler3s
          ? [2, 3, 4, 5, 6]
          : wendler1s
            ? [1, 2, 3, 4, 5]
            : DEFAULT_REP_CHOICES),
  );

  const isDecrementDisabled = useMemo(() => reps <= MIN_REPS, [reps]);

  const handleToggleChange = React.useCallback(
    (_e: React.MouseEvent<HTMLElement> | null, val: number | string | null) => {
      if (!val) return;
      if (val === "-" && !isDecrementDisabled) {
        setReps((reps) => reps - 1);
      } else if (val === "+") {
        setReps((reps) => reps + 1);
      } else if (typeof val === "number") {
        setReps((_reps) => val);
      }
    },
    [setReps, isDecrementDisabled],
  );

  const handleSetAvailableRepsClose = React.useCallback(
    (newChoices: number[]) => {
      setLocalRepChoices(newChoices);
      // Snap to a valid rep if current is not in new choices
      if (!newChoices.includes(reps) && newChoices.length > 0) {
        setReps(newChoices[0]);
      }
    },
    [reps, setReps],
  );

  return {
    choices: localRepChoices,
    setChoices: setLocalRepChoices,
    handleToggleChange,
    handleSetAvailableRepsClose,
    MIN_REPS,
    isDecrementDisabled,
  };
};
