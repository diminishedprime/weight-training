import DisplayDumbbell from "@/components/display/DisplayDumbbell";
import { EquipmentWeightEditorProps } from "@/components/edit/weight/EquipmentWeightEditor";
import useEditableWeight from "@/components/edit/weight/useEditableWeight";
import { TestIds } from "@/test-ids";
import { Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React from "react";

export interface EditDumbbellProps extends EquipmentWeightEditorProps {
  availableDumbbells: number[];
}

const EditDumbbell: React.FC<EditDumbbellProps> = (props) => {
  const api = useEditDumbellAPI(props);

  return (
    <Stack spacing={1} useFlexGap alignItems="center">
      <DisplayDumbbell weight={api.actual} weightUnit={props.weightUnit} />
      {props.editing && (
        <Stack spacing={1} direction="row" alignItems="center" sx={{ mt: 1 }}>
          <Button
            data-testid={TestIds.EditDumbbellBumpDownButton}
            variant="outlined"
            color="secondary"
            onClick={api.handleBumpDown}
            disabled={api.currentIdx <= 0}
          >
            Down
          </Button>
          <Autocomplete
            freeSolo
            options={api.availableWeights}
            value={api.actual}
            getOptionLabel={(option) => option.toString()}
            onChange={(_, newValue) => api.handleWeightChange(newValue)}
            inputValue={String(api.actual)}
            onInputChange={(_, newInputValue) =>
              api.handleInputChange(newInputValue)
            }
            disableClearable
            renderInput={(params) => (
              <TextField {...params} size="small" sx={{ width: "7ch" }} />
            )}
          />
          <Button
            variant="outlined"
            onClick={api.handleBumpUp}
            disabled={api.currentIdx >= api.availableWeights.length - 1}
          >
            Up
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default EditDumbbell;

const useEditDumbellAPI = (props: EditDumbbellProps) => {
  const {
    availableDumbbells,
    serverTarget,
    serverActual,
    onActualChange,
    onTargetChange,
  } = props;

  const [availableWeights, setAvailableWeights] = React.useState(() => {
    const copy = [...availableDumbbells];
    copy.sort((a, b) => a - b);
    return copy;
  });

  const targetToActual = React.useCallback(
    (target: number) => {
      // Find the closest available dumbbell weight
      const closest = availableWeights.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
      );
      return closest;
    },
    [availableWeights],
  );

  const { actual, setActual } = useEditableWeight(
    serverTarget,
    serverActual,
    targetToActual,
    onActualChange,
    onTargetChange,
  );

  const currentIdx = React.useMemo(() => {
    return availableWeights.findIndex((w) => w === actual);
  }, [availableWeights, actual]);

  const handleBumpDown = React.useCallback(() => {
    if (currentIdx === -1) return;
    const firstIdx = 0;
    const prevIdx = Math.max(currentIdx - 1, firstIdx);
    setActual(availableWeights[prevIdx]);
  }, [setActual, currentIdx, availableWeights]);

  const handleBumpUp = React.useCallback(() => {
    if (currentIdx === -1) return;
    const lastIdx = availableWeights.length - 1;
    const nextIdx = Math.min(currentIdx + 1, lastIdx);
    setActual(availableWeights[nextIdx]);
  }, [setActual, currentIdx, availableWeights]);

  const handleWeightChange = React.useCallback(
    (newValue: unknown) => {
      const val = Number(newValue);
      if (!isNaN(val) && val >= 0) {
        // If the value is not in availableWeights, add it and sort
        if (!availableWeights.includes(val)) {
          setAvailableWeights((prev) => [...prev, val].sort((a, b) => a - b));
        }
        setActual(val);
      }
    },
    [setActual, availableWeights],
  );

  const handleInputChange = React.useCallback(
    (newInputValue: string) => {
      const val = Number(newInputValue);
      if (!isNaN(val) && val >= 0) {
        // If the value is not in availableWeights, add it and sort
        if (!availableWeights.includes(val)) {
          setAvailableWeights((prev) => [...prev, val].sort((a, b) => a - b));
        }
        setActual(val);
      }
    },
    [setActual, availableWeights],
  );

  return {
    actual,
    availableWeights,
    currentIdx,
    handleBumpDown,
    handleBumpUp,
    handleWeightChange,
    handleInputChange,
  };
};
