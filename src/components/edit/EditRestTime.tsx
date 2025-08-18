import { RDispatch } from "@/common-types";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  restTime: number;
  setRestTime: RDispatch<number>;
}

const EditRestTime: React.FC<Props> = (props) => {
  const api = useEditRestTimeApi(props);
  return (
    <Stack direction="row" flexWrap="wrap">
      <Button
        variant="outlined"
        onClick={() => api.addTime(-15)}
        disabled={api.subTimeDisabled}
      >
        -15
      </Button>
      <TextField
        label="Rest Time"
        size="small"
        value={api.input}
        onChange={(e) => api.setInput(e.target.value)}
        sx={{ width: "9ch" }}
        slotProps={{
          input: {
            endAdornment: (
              <Typography
                component="span"
                sx={{ color: "text.secondary", ml: 0.5 }}
              >
                s
              </Typography>
            ),
            inputProps: {
              sx: {
                textAlign: "center",
              },
            },
          },
        }}
      />
      <Button variant="outlined" onClick={() => api.addTime(15)}>
        +15
      </Button>
    </Stack>
  );
};

export default EditRestTime;

const useEditRestTimeApi = (props: Props) => {
  const { setRestTime, restTime } = props;
  const [input, setInput] = useState(props.restTime.toString());

  const addTime = useCallback(
    (time: number) => {
      const nu = Math.max(restTime + time, 0);
      setRestTime((_) => nu);
      setInput((_) => nu.toString());
    },
    [restTime, setRestTime],
  );

  const subTimeDisabled = useMemo(() => restTime <= 0, [restTime]);

  useEffect(() => {
    const parsed = Number(input);
    if (!isNaN(parsed)) {
      setRestTime(parsed);
    }
  }, [input, setRestTime]);

  return { input, setInput, addTime, subTimeDisabled };
};
