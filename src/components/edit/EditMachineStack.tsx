import { WeightUnit } from "@/common-types";
import DisplayWeight from "@/components/display/DisplayWeight";
import { Button, Radio, Stack, SxProps, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";

interface EditMachineStackProps {
  weightValue: number;
  setWeightValue: React.Dispatch<React.SetStateAction<number>>;
  weightUnit: WeightUnit;
}

const EditMachineStack: React.FC<EditMachineStackProps> = (props) => {
  const api = useEditMachineStackAPI(props);
  return (
    <Stack spacing={1} alignItems="center">
      <DisplayWeight
        variant="h6"
        sx={{ mb: 0 }}
        weightUnit={props.weightUnit}
        weightValue={props.weightValue}
      />
      <Stack alignItems="center">
        <StackPlate
          checked={api.isBumpActive}
          sx={{ width: "9ch" }}
          onChange={api.onBumpChange}
        >
          {api.bump}
        </StackPlate>
        {api.stack.map((plateValue, idx) => (
          <StackPlate
            key={`${idx}`}
            checked={api.selectedPlate === plateValue}
            onChange={(checked) => api.onStackPlateChange(plateValue, checked)}
          >
            {plateValue}
          </StackPlate>
        ))}
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={api.onDecrement}
        >
          -
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={api.onIncrement}
        >
          +
        </Button>
      </Stack>
    </Stack>
  );
};

export default EditMachineStack;

interface StackPlateProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  sx?: SxProps;
}

const StackPlate: React.FC<StackPlateProps> = (props) => {
  return (
    <Stack
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid black",
        borderBottom: "none",
        width: "12ch",
        "&:last-child": { borderBottom: "1px solid black" },
        ...props.sx,
      }}
    >
      <Typography
        alignItems="flex-end"
        variant="caption"
        component="span"
        textAlign="right"
      >
        {props.children}
      </Typography>
      <Radio
        color="primary"
        checked={props.checked}
        size="small"
        onClick={() => props.onChange(!props.checked)}
        sx={{ p: 0 }}
      />
      <Stack />
    </Stack>
  );
};

const stacksForWeight = (maxWeight: number, plateWeights: number) => {
  const stack = [];
  const divisions = maxWeight / plateWeights;
  for (let i = 0; i < divisions; i++) {
    stack.push(plateWeights * (i + 1));
  }
  return stack;
};

// TODO: make it where you can continue to bump up past the max weight, but when
// doing so it will change the max weight and adjust the number of plates
// accordingly.
// TODO: Make a settings gear where you can edit how the machine stack works.
// TODO: Make it where you can select the bump amount from a ToggleButtonGroup.
// TODO: Make it where you can select the stack plate weight from a ToggleButtonGroup.
// TODO: consider making it where it "cleans up" the initial weight value if it
// doesn't make sense for the configuration.
// TODO: figure out a way to have the machine stack defaults come from user
// preferences, they probably should be done per exerciseType and there should
// probably be a default for each one based on real-world gyms.
const useEditMachineStackAPI = (props: EditMachineStackProps) => {
  const { weightValue, setWeightValue } = props;
  const [bump] = useState(5);
  const [stackPlateWeightValue] = useState(10);
  const [maxWeightValue] = useState(200);

  const stack = useMemo(
    () => stacksForWeight(maxWeightValue, stackPlateWeightValue),
    [maxWeightValue, stackPlateWeightValue],
  );

  const selectedPlate = useMemo(
    () =>
      weightValue % stackPlateWeightValue === 0
        ? weightValue
        : weightValue - bump,
    [weightValue, stackPlateWeightValue, bump],
  );

  const isBumpActive = useMemo(
    () => weightValue - selectedPlate === bump,
    [weightValue, selectedPlate, bump],
  );

  const onBumpChange = useCallback(
    (checked: boolean) => {
      setWeightValue((prev) => (checked ? prev + bump : prev - bump));
    },
    [bump, setWeightValue],
  );

  const onStackPlateChange = useCallback(
    (plateValue: number, checked: boolean) => {
      if (checked) {
        setWeightValue(isBumpActive ? plateValue + bump : plateValue);
      }
    },
    [setWeightValue, isBumpActive, bump],
  );

  const onIncrement = useCallback(() => {
    setWeightValue((prev) => {
      const next = prev + bump;
      return next > maxWeightValue ? maxWeightValue : next;
    });
  }, [bump, setWeightValue, maxWeightValue]);

  const onDecrement = useCallback(() => {
    setWeightValue((prev) => {
      const next = prev - bump;
      return next < 0 ? 0 : next;
    });
  }, [bump, setWeightValue]);

  return {
    stack,
    bump,
    isBumpActive,
    onBumpChange,
    selectedPlate,
    onStackPlateChange,
    onIncrement,
    onDecrement,
  };
};
