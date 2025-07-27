import { RoundingMode, WeightUnit } from "@/common-types";
import DisplayPlateStack from "@/components/display/DisplayPlateStack";
import DisplayWeight from "@/components/display/DisplayWeight";
import SelectActivePlates from "@/components/select/SelectActivePlates";
import { minimalPlates } from "@/util";
import { Stack } from "@mui/material";
import { Stack as ImmutableStack } from "immutable";
import { useCallback, useMemo, useState } from "react";

interface EditPlateStackProps {
  weightValue: number;
  setWeightValue: React.Dispatch<React.SetStateAction<number>>;
  availablePlates: number[];
  weightUnit: WeightUnit;
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
        weightValue={props.weightValue}
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
  const { setWeightValue } = props;

  const [history, setHistory] = useState(ImmutableStack<number>());

  const selectedPlates = useMemo(() => {
    const { plates } = minimalPlates(
      props.weightValue,
      props.availablePlates,
      RoundingMode.NEAREST,
    );
    return plates;
  }, [props.weightValue, props.availablePlates]);

  const addPlate = useCallback(
    (plate: number) => {
      setHistory((prev) => prev.push(plate));
      setWeightValue((prev) => prev + plate);
    },
    [setWeightValue],
  );

  const clearPlates = useCallback(() => {
    setWeightValue(0);
  }, [setWeightValue]);

  const clearDisabled = useMemo(
    () => selectedPlates.length === 0,
    [selectedPlates],
  );

  const undoAddPlate = useCallback(() => {
    const previousPlate = history.peek();
    console.log("Undoing last plate", previousPlate);
    if (previousPlate === undefined) {
      return;
    }
    setHistory((prev) => prev.pop());
    setWeightValue((prev) => prev - previousPlate);
  }, [history, setHistory, setWeightValue]);

  const undoDisabled = useMemo(() => history.isEmpty(), [history]);

  return {
    selectedPlates,
    addPlate,
    clearPlates,
    clearDisabled,
    undoAddPlate,
    undoDisabled,
  };
};
