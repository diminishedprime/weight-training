import { RoundingMode } from "@/common-types";
import DisplayPlateStack from "@/components/display/DisplayPlateStack";
import DisplayWeight from "@/components/display/DisplayWeight";
import { EquipmentWeightEditorProps } from "@/components/edit/weight/EquipmentWeightEditor";
import useEditableWeight from "@/components/edit/weight/useEditableWeight";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import { minimalPlates } from "@/util";
import { Stack } from "@mui/material";
import { useCallback, useMemo } from "react";

interface EditPlateStackProps extends EquipmentWeightEditorProps {
  availablePlates: number[];
}

// TODO: This should probably be configurable for whether or not it always
// collapses the plates into the minimum required to reach the target weight,
// especially since sometimes people just want to "add another 10" and that gets
// annoying if the UI always collapses the plates and makes you change the base
// plates.
const EditPlateStack: React.FC<EditPlateStackProps> = (props) => {
  const api = useEditPlateStackAPI(props);
  return (
    <Stack spacing={1} alignItems="center" justifyContent="space-between">
      <DisplayWeight weightValue={api.actual} weightUnit={props.weightUnit} />
      <Stack alignItems="center" spacing={1}>
        <DisplayPlateStack
          plates={api.selectedPlates}
          weightUnit={"pounds"}
          showWeight
        />
        <SelectActivePlates
          editing={props.editing}
          availablePlates={props.availablePlates}
          activePlates={api.selectedPlates}
          onAddPlate={api.addPlate}
          onRemovePlate={api.removePlate}
          onClear={api.resetToResolvedTarget}
          clearDisabled={api.resetDisabled}
          onUndo={api.undo}
          undoDisabled={api.undoDisabled}
          removePlateDisabled={api.removePlateDisabled}
        />
      </Stack>
    </Stack>
  );
};

export default EditPlateStack;

const useEditPlateStackAPI = (props: EditPlateStackProps) => {
  const {
    serverActual,
    serverTarget,
    availablePlates,
    roundingMode,
    onActualChange,
    onTargetChange,
  } = props;

  const targetToActual = useCallback(
    (target: number) =>
      minimalPlates(target, availablePlates, roundingMode).plates.reduce(
        (a, b) => a + b,
        0,
      ),
    [availablePlates, roundingMode],
  );

  const {
    actual,
    setActual,
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

  const selectedPlates = useMemo(
    () => minimalPlates(actual, availablePlates, RoundingMode.NEAREST).plates,
    [actual, availablePlates],
  );

  const addPlate = useCallback(
    (plate: number) => {
      setActual((prev) => prev + plate);
    },
    [setActual],
  );

  const removePlate = useCallback(
    (plate: number) => {
      setActual((prev) => prev - plate);
    },
    [setActual],
  );

  const removePlateDisabled = useCallback(
    (plate: number) => actual < plate,
    [actual],
  );

  return {
    actual,
    selectedPlates,
    addPlate,
    removePlate,
    removePlateDisabled,
    resetDisabled,
    resetToResolvedTarget,
    undo,
    undoDisabled,
  };
};
