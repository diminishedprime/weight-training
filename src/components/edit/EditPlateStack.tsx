import { RDispatch, RoundingMode, WeightUnit } from "@/common-types";
import DisplayPlateStack from "@/components/display/DisplayPlateStack";
import DisplayWeight from "@/components/display/DisplayWeight";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import { useResolvableWeight } from "@/hooks";
import { minimalPlates } from "@/util";
import { Stack } from "@mui/material";
import { Stack as ImmutableStack } from "immutable";
import { useCallback, useMemo, useState } from "react";

interface EditPlateStackProps {
  actualWeightValue: number | undefined;
  setActualWeightValue: RDispatch<number | undefined>;
  targetWeightValue: number;
  availablePlates: number[];
  weightUnit: WeightUnit;
  roundingMode: RoundingMode;
}

// TODO: This should probably be configurable for whether or not it always
// collapses the plates into the minimum required to reach the target weight,
// especially since sometimes people just want to "add another 10" and that gets
// annoying if the UI always collapses the plates and makes you change the base
// plates.
const EditPlateStack: React.FC<EditPlateStackProps> = (props) => {
  const api = useEditPlateStackAPI(props);
  return (
    <Stack
      spacing={1}
      alignItems="center"
      minHeight="25ch"
      justifyContent="space-between"
    >
      <DisplayWeight
        weightValue={api.resolvedWeight}
        weightUnit={props.weightUnit}
      />
      <Stack alignItems="center" spacing={1}>
        <DisplayPlateStack
          plates={api.selectedPlates}
          weightUnit={"pounds"}
          showWeight
        />
        <SelectActivePlates
          availablePlates={props.availablePlates}
          activePlates={api.selectedPlates}
          onAddPlate={api.addPlate}
          onClear={api.clearPlates}
          clearDisabled={api.clearDisabled}
          onUndo={api.undoAddPlate}
          undoDisabled={api.undoDisabled}
        />
      </Stack>
    </Stack>
  );
};

export default EditPlateStack;

const useEditPlateStackAPI = (props: EditPlateStackProps) => {
  const {
    setActualWeightValue,
    actualWeightValue,
    targetWeightValue,
    availablePlates,
    roundingMode,
  } = props;
  const [history, setHistory] = useState(ImmutableStack<number>());

  const targetToActual = useCallback(
    (target: number) =>
      minimalPlates(target, availablePlates, roundingMode).plates.reduce(
        (a, b) => a + b,
        0,
      ),
    [availablePlates, roundingMode],
  );

  const [resolvedWeight, setResolvedWeight] = useResolvableWeight(
    actualWeightValue,
    setActualWeightValue,
    targetWeightValue,
    targetToActual,
  );

  const selectedPlates = useMemo(
    () =>
      minimalPlates(resolvedWeight, availablePlates, RoundingMode.NEAREST)
        .plates,
    [resolvedWeight, availablePlates],
  );

  const addPlate = useCallback(
    (plate: number) => {
      setHistory((prev) => prev.push(plate));
      setResolvedWeight((prev) => prev + plate);
    },
    [setResolvedWeight],
  );

  const clearPlates = useCallback(() => {
    setResolvedWeight(0);
  }, [setResolvedWeight]);

  const clearDisabled = useMemo(
    () => selectedPlates.length === 0,
    [selectedPlates],
  );

  const undoAddPlate = useCallback(() => {
    const previousPlate = history.peek();
    if (previousPlate === undefined) {
      return;
    }
    setHistory((prev) => prev.pop());
    setResolvedWeight((prev) => prev - previousPlate);
  }, [history, setHistory, setResolvedWeight]);

  const undoDisabled = useMemo(() => history.isEmpty(), [history]);

  return {
    resolvedWeight,
    selectedPlates,
    addPlate,
    clearPlates,
    clearDisabled,
    undoAddPlate,
    undoDisabled,
  };
};
