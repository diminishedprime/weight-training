import { TestIds } from "@/test-ids";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { Stack as ImmutableStack } from "immutable";
import { useCallback, useEffect, useMemo, useState } from "react";

interface EditWeightProps {
  weightValue: number;
  setWeightValue: React.Dispatch<React.SetStateAction<number>>;
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

const EditWeight: React.FC<EditWeightProps> = (props) => {
  const api = useEditWeightAPI(props);
  return (
    <Stack spacing={1} alignItems="center">
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent={"center"}
      >
        {props.undo && (
          <IconButton
            color="primary"
            size="small"
            onClick={api.handleUndo}
            aria-label="Undo weight change"
            disabled={api.undoDisabled}
          >
            <UndoIcon />
          </IconButton>
        )}
        {props.sub25 && (
          <Button
            data-testid={TestIds.EditWeightSubtract(25)}
            variant="outlined"
            color="secondary"
            onClick={() => api.onSubtractWeight(25)}
          >
            -25
          </Button>
        )}
        {props.sub10 && (
          <Button
            data-testid={TestIds.EditWeightSubtract(10)}
            variant="outlined"
            color="secondary"
            onClick={() => api.onSubtractWeight(10)}
          >
            -10
          </Button>
        )}
        {props.sub5 && (
          <Button
            data-testid={TestIds.EditWeightSubtract(5)}
            variant="outlined"
            color="secondary"
            onClick={() => api.onSubtractWeight(5)}
          >
            -5
          </Button>
        )}
        {props.sub1 && (
          <Button
            data-testid={TestIds.EditWeightSubtract(1)}
            variant="outlined"
            color="secondary"
            onClick={() => api.onSubtractWeight(1)}
          >
            -1
          </Button>
        )}
        <TextField
          size="small"
          value={api.inputValue}
          sx={{
            width: "11ch",
            "& .MuiInputBase-input": {
              textAlign: "center",
            },
          }}
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
                  onClick={api.clear}
                  disabled={api.clearDisabled}
                >
                  <DeleteIcon />
                </IconButton>
              ),
            },
          }}
        />
        {props.add1 && (
          <Button
            data-testid={TestIds.EditWeightAdd(1)}
            variant="outlined"
            color="primary"
            onClick={() => api.onAddWeight(1)}
          >
            +1
          </Button>
        )}
        {props.add5 && (
          <Button
            data-testid={TestIds.EditWeightAdd(5)}
            variant="outlined"
            color="primary"
            onClick={() => api.onAddWeight(5)}
          >
            +5
          </Button>
        )}
        {props.add10 && (
          <Button
            data-testid={TestIds.EditWeightAdd(10)}
            variant="outlined"
            color="primary"
            onClick={() => api.onAddWeight(10)}
          >
            +10
          </Button>
        )}
        {props.add25 && (
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
};

export default EditWeight;

const useEditWeightAPI = (props: EditWeightProps) => {
  const { weightValue, setWeightValue, clearValue } = props;
  const [inputValue, setInputValue] = useState(props.weightValue.toString());

  useEffect(() => {
    setInputValue(weightValue.toString());
  }, [weightValue]);

  // Internal stack for undo history
  const [weightValueHistory, setWeightValueHistory] = useState(() =>
    ImmutableStack<number>([weightValue]),
  );

  const onInputBlur = useCallback(() => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      setWeightValue(parsedValue);
      setWeightValueHistory((old) => old.push(parsedValue));
    }
  }, [inputValue, setWeightValue]);

  const onAddWeight = useCallback(
    (toAdd: number) => {
      const nuValue = weightValue + toAdd;
      setWeightValue((prev) => prev + toAdd);
      setWeightValueHistory((old) => old.push(nuValue));
    },
    [setWeightValue, weightValue],
  );

  const onSubtractWeight = useCallback(
    (toSubtract: number) => {
      const nuValue = Math.max(weightValue - toSubtract, 0);
      setWeightValue((prev) => Math.max(prev - toSubtract, 0));
      setWeightValueHistory((old) => old.push(nuValue));
    },
    [setWeightValue, weightValue],
  );

  const onSubtractDisabled = useMemo(() => {
    return weightValue <= 0;
  }, [weightValue]);

  const handleUndo = useCallback(() => {
    const noCurrentWeight = weightValueHistory.pop();
    const previousWeight = noCurrentWeight.peek();
    setWeightValue((_) => previousWeight!);
    setWeightValueHistory((old) => old.pop());
  }, [weightValueHistory, setWeightValue, setWeightValueHistory]);

  const undoDisabled = useMemo(
    () => weightValueHistory.size === 1,
    [weightValueHistory.size],
  );

  const clear = useCallback(() => {
    setWeightValue(clearValue || 0);
  }, [setWeightValue, clearValue]);

  const clearDisabled = useMemo(() => {
    if (clearValue !== undefined) {
      return weightValue <= clearValue;
    }
    return weightValue <= 0;
  }, [weightValue, clearValue]);

  return {
    onAddWeight,
    onSubtractWeight,
    onSubtractDisabled,
    clear,
    onInputBlur,
    inputValue,
    setInputValue,
    clearDisabled,
    handleUndo,
    undoDisabled,
  };
};
