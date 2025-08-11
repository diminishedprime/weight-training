import DisplayWeight from "@/components/display/DisplayWeight";
import { EquipmentWeightEditorProps } from "@/components/edit/weight/EquipmentWeightEditor";
import useEditableWeight from "@/components/edit/weight/useEditableWeight";
import { TestIds } from "@/test-ids";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

export interface EditWeightHandle {
  setActual: (value: number) => void;
  actual: number;
}

interface EditWeightProps
  extends Omit<
    EquipmentWeightEditorProps,
    "preferences" | "barWeight" | "roundingMode" | "equipmentType"
  > {
  add1?: boolean;
  sub1?: boolean;
  add5?: boolean;
  sub5?: boolean;
  add10?: boolean;
  sub10?: boolean;
  add25?: boolean;
  sub25?: boolean;
  undo?: boolean;
  clearValue?: number;
}

const EditWeight = forwardRef<EditWeightHandle, EditWeightProps>(
  (props, ref) => {
    const api = useEditWeightAPI(props);

    useImperativeHandle(
      ref,
      () => ({
        setActual: (value: number) => api.setActual(value),
        actual: api.actual,
      }),
      [api],
    );

    return (
      <Stack spacing={1} alignItems="center">
        <Stack
          spacing={0.5}
          direction="row"
          alignItems="center"
          justifyContent={"center"}
          flexWrap="wrap"
          useFlexGap
        >
          {props.undo && props.editing && (
            <IconButton
              color="primary"
              size="small"
              onClick={api.undo}
              aria-label="Undo weight change"
              disabled={api.undoDisabled}
            >
              <UndoIcon />
            </IconButton>
          )}
          {props.sub25 && props.editing && (
            <Button
              data-testid={TestIds.EditWeightSubtract(25)}
              variant="outlined"
              color="secondary"
              onClick={() => api.onSubtractWeight(25)}
            >
              -25
            </Button>
          )}
          {props.sub10 && props.editing && (
            <Button
              data-testid={TestIds.EditWeightSubtract(10)}
              variant="outlined"
              color="secondary"
              onClick={() => api.onSubtractWeight(10)}
            >
              -10
            </Button>
          )}
          {props.sub5 && props.editing && (
            <Button
              data-testid={TestIds.EditWeightSubtract(5)}
              variant="outlined"
              color="secondary"
              onClick={() => api.onSubtractWeight(5)}
            >
              -5
            </Button>
          )}
          {props.sub1 && props.editing && (
            <Button
              data-testid={TestIds.EditWeightSubtract(1)}
              variant="outlined"
              color="secondary"
              onClick={() => api.onSubtractWeight(1)}
            >
              -1
            </Button>
          )}
          {props.editing ? (
            <TextField
              size="small"
              value={api.inputValue}
              sx={{
                width: "11ch",
                "& .MuiInputBase-input": {
                  textAlign: "center",
                },
              }}
              disabled={!props.editing}
              variant="outlined"
              onBlur={api.onInputBlur}
              onChange={(e) => api.setInputValue(e.target.value)}
              slotProps={{
                htmlInput: {
                  "data-testid": TestIds.EditWeightInput,
                },
                input: {
                  endAdornment: (
                    <IconButton
                      data-testid={TestIds.EditWeightClearButton}
                      color="error"
                      sx={{ p: 0, m: 0 }}
                      onClick={api.resetToResolvedTarget}
                      disabled={api.resetDisabled}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ),
                },
              }}
            />
          ) : (
            <DisplayWeight
              weightValue={api.actual}
              weightUnit={props.weightUnit}
              variant="h4"
            />
          )}
          {props.add1 && props.editing && (
            <Button
              data-testid={TestIds.EditWeightAdd(1)}
              variant="outlined"
              color="primary"
              onClick={() => api.onAddWeight(1)}
            >
              +1
            </Button>
          )}
          {props.add5 && props.editing && (
            <Button
              data-testid={TestIds.EditWeightAdd(5)}
              variant="outlined"
              color="primary"
              onClick={() => api.onAddWeight(5)}
            >
              +5
            </Button>
          )}
          {props.add10 && props.editing && (
            <Button
              data-testid={TestIds.EditWeightAdd(10)}
              variant="outlined"
              color="primary"
              onClick={() => api.onAddWeight(10)}
            >
              +10
            </Button>
          )}
          {props.add25 && props.editing && (
            <Button
              data-testid={TestIds.EditWeightAdd(25)}
              variant="outlined"
              color="primary"
              onClick={() => api.onAddWeight(25)}
            >
              +25
            </Button>
          )}
        </Stack>
      </Stack>
    );
  },
);
EditWeight.displayName = "EditWeight";

export default EditWeight;

const useEditWeightAPI = (props: EditWeightProps) => {
  const { serverActual, serverTarget, onActualChange, onTargetChange } = props;

  const targetToActual = useCallback((a: number) => a, []);

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

  const [inputValue, setInputValue] = useState(actual.toString());

  useEffect(() => {
    setInputValue(actual.toString());
  }, [actual]);

  const onInputBlur = useCallback(() => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      setActual(parsedValue);
    }
  }, [inputValue, setActual]);

  const onAddWeight = useCallback(
    (toAdd: number) => {
      setActual((prev) => prev + toAdd);
    },
    [setActual],
  );

  const onSubtractWeight = useCallback(
    (toSubtract: number) => {
      setActual((prev) => Math.max(prev - toSubtract, 0));
    },
    [setActual],
  );

  const onSubtractDisabled = useMemo(() => {
    return actual <= 0;
  }, [actual]);

  return {
    actual,
    setActual, // Expose setActual for imperative handle
    onAddWeight,
    onSubtractWeight,
    onSubtractDisabled,
    onInputBlur,
    inputValue,
    setInputValue,
    undoDisabled,
    undo,
    resetDisabled,
    resetToResolvedTarget,
  };
};
