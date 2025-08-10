import DisplayWeight from "@/components/display/DisplayWeight";
import TODO from "@/components/TODO";
import { Button, Radio, Stack, SxProps, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { EquipmentWeightEditorProps } from "./EquipmentWeightEditor";
import useEditableWeight from "./useEditableWeight";

const EditMachineStack: React.FC<EquipmentWeightEditorProps> = (props) => {
  const api = useEditMachineStackAPI(props);
  return (
    <Stack spacing={1} alignItems="center">
      <TODO>
        Figure out a clean way to animate this when you pick a heaver/lighter
        value.
      </TODO>
      <DisplayWeight
        variant="h6"
        sx={{ mb: 0 }}
        weightValue={api.actual}
        weightUnit={props.weightUnit}
      />
      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-end"
        justifyContent="flex-end"
      >
        {props.editing && (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={api.onDecrement}
          >
            -
          </Button>
        )}
        <Stack alignItems="center">
          <StackPlate
            editing={props.editing}
            checked={api.isBumpActive}
            sx={{ width: "9ch" }}
            onChange={api.onBumpChange}
          >
            {api.bump}
          </StackPlate>
          <Stack sx={{ width: "12ch" }}>
            {api.visiblePlates.map((plateValue) => (
              <StackPlate
                editing={props.editing}
                key={plateValue}
                checked={api.selectedPlate === plateValue}
                onChange={(checked) =>
                  api.onStackPlateChange(plateValue, checked)
                }
              >
                {plateValue}
              </StackPlate>
            ))}
          </Stack>
        </Stack>
        {props.editing && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={api.onIncrement}
          >
            +
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default EditMachineStack;

interface StackPlateProps {
  editing: boolean;
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
        my: "0.75px",
        width: "12ch",
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
        disabled={!props.editing}
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

const nearestWeight = (stack: number[], bump: number, target: number) => {
  const possibleWeights = stack.flatMap((v) => [v, v + bump]);
  possibleWeights.sort((a, b) => a - b);
  // We can find the last valid weight that is less than or equal to the target
  const weight = possibleWeights.findLast((v) => v <= target);
  // If no valid weight is found, return the first possible weight
  return weight ? weight : possibleWeights[0];
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
const useEditMachineStackAPI = (props: EquipmentWeightEditorProps) => {
  const { serverActual, serverTarget, onActualChange, onTargetChange } = props;
  const [bump] = useState(5);
  const [stackPlateWeightValue] = useState(10);
  const [maxWeightValue] = useState(500);

  const stack = useMemo(
    () => stacksForWeight(maxWeightValue, stackPlateWeightValue),
    [maxWeightValue, stackPlateWeightValue],
  );

  const targetToActual = useCallback(
    (target: number) => nearestWeight(stack, bump, target),
    [stack, bump],
  );

  const {
    actual,
    setActual,
    target,
    undo,
    undoDisabled,
    resetToResolvedTarget,
    resetDisabled,
  } = useEditableWeight(
    serverTarget,
    serverActual,
    targetToActual,
    onActualChange,
    onTargetChange,
  );

  const selectedPlate = useMemo(
    () => (actual % stackPlateWeightValue === 0 ? actual : actual - bump),
    [actual, stackPlateWeightValue, bump],
  );

  const isBumpActive = useMemo(
    () => actual - selectedPlate === bump,
    [actual, selectedPlate, bump],
  );

  const onBumpChange = useCallback(
    (checked: boolean) => {
      setActual((prev) => (checked ? prev + bump : prev - bump));
    },
    [bump, setActual],
  );

  const onStackPlateChange = useCallback(
    (plateValue: number, checked: boolean) => {
      if (checked) {
        setActual(isBumpActive ? plateValue + bump : plateValue);
      }
    },
    [setActual, isBumpActive, bump],
  );

  const onIncrement = useCallback(() => {
    setActual((prev) => {
      const next = prev + bump;
      return next > maxWeightValue ? maxWeightValue : next;
    });
  }, [bump, setActual, maxWeightValue]);

  const onDecrement = useCallback(() => {
    setActual((prev) => {
      const next = prev - bump;
      return next < 0 ? 0 : next;
    });
  }, [bump, setActual]);

  const visiblePlates = useMemo(() => {
    const lensSize = 5;
    const selectedIdx = stack.findIndex((v) => v === selectedPlate);
    if (selectedIdx <= 2) {
      return stack.slice(0, lensSize);
    }
    if (selectedIdx >= stack.length - 3) {
      return stack.slice(-lensSize);
    }
    return stack.slice(selectedIdx - 2, selectedIdx + 3);
  }, [stack, selectedPlate]);

  // Show tear lines if not rendering first/last plate
  const showTearTop = useMemo(
    () => visiblePlates.length > 0 && visiblePlates[0] !== stack[0],
    [visiblePlates, stack],
  );
  const showTearBottom = useMemo(
    () =>
      visiblePlates.length > 0 &&
      visiblePlates[visiblePlates.length - 1] !== stack[stack.length - 1],
    [visiblePlates, stack],
  );

  return {
    actual,
    target,
    stack,
    bump,
    isBumpActive,
    onBumpChange,
    selectedPlate,
    onStackPlateChange,
    onIncrement,
    onDecrement,
    visiblePlates,
    showTearTop,
    showTearBottom,
  };
};
