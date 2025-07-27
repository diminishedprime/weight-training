import { TestIds } from "@/test-ids";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

interface EditWeightProps {
  weightValue: number;
  setWeightValue: React.Dispatch<React.SetStateAction<number>>;
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
        <Button
          data-testid={TestIds.EditWeightSubtract(25)}
          variant="outlined"
          color="secondary"
          onClick={() => api.onSubtractWeight(25)}
          disabled={api.onSubtractDisabled}
        >
          -25
        </Button>
        <Button
          data-testid={TestIds.EditWeightSubtract(5)}
          variant="outlined"
          color="secondary"
          onClick={() => api.onSubtractWeight(5)}
          disabled={api.onSubtractDisabled}
        >
          -5
        </Button>
        <TextField
          size="small"
          value={api.inputValue}
          sx={{
            width: "10ch",
            "& .MuiInputBase-input": {
              textAlign: "center",
            },
          }}
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
        <Button
          data-testid={TestIds.EditWeightAdd(5)}
          variant="outlined"
          color="primary"
          onClick={() => api.onAddWeight(5)}
        >
          +5
        </Button>
        <Button
          data-testid={TestIds.EditWeightAdd(25)}
          variant="outlined"
          color="primary"
          onClick={() => api.onAddWeight(25)}
        >
          +25
        </Button>
      </Stack>
    </Stack>
  );
};

export default EditWeight;

const useEditWeightAPI = (props: EditWeightProps) => {
  const { weightValue, setWeightValue } = props;

  const [inputValue, setInputValue] = useState(props.weightValue.toString());

  const onInputBlur = useCallback(() => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      setWeightValue(parsedValue);
    }
  }, [inputValue, setWeightValue]);

  const onAddWeight = useCallback(
    (toAdd: number) => {
      const nuValue = weightValue + toAdd;
      setWeightValue((prev) => prev + toAdd);
      setInputValue(nuValue.toString());
    },
    [setWeightValue, weightValue],
  );

  const onSubtractWeight = useCallback(
    (toSubtract: number) => {
      const nuValue = Math.max(weightValue - toSubtract, 0);
      setWeightValue((prev) => Math.max(prev - toSubtract, 0));
      setInputValue(nuValue.toString());
    },
    [setWeightValue, weightValue],
  );

  const onSubtractDisabled = useMemo(() => {
    return weightValue <= 0;
  }, [weightValue]);

  const clear = useCallback(() => {
    setWeightValue(0);
    setInputValue("0");
  }, [setWeightValue]);

  const clearDisabled = useMemo(() => {
    return weightValue <= 0;
  }, [weightValue]);

  return {
    onAddWeight,
    onSubtractWeight,
    onSubtractDisabled,
    clear,
    onInputBlur,
    inputValue,
    setInputValue,
    clearDisabled,
  };
};
