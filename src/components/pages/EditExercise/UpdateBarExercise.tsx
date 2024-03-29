import { css } from '@emotion/react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { navigate } from 'gatsby';
import * as React from 'react';
import Bar from '@/components/common/Bar';
import useDeleteExercise from '@/components/pages/EditExercise/useDeleteExercise';
import useUpdateBarExercise from '@/components/pages/EditExercise/useUpdateBarExercise';
import AddPlates from '@/components/pages/Exercise/AddPlates';
import SetReps from '@/components/pages/Exercise/SetReps';
import usePlates from '@/components/pages/Exercise/usePlates';
import { BarExerciseData, exerciseUIString, WithID } from '@/types';
import { barExerciseWeight, fromDBExercise, platesForWeight } from '@/util';

const repsAndWarmupRowCss = css`
  display: flex;
  align-items: end;
  justify-content: space-around;
`;

const buttonRowCss = css`
  display: flex;
  justify-content: space-between;
`;

interface UpdateBarExerciseProps {
  barExerciseData: WithID<BarExerciseData>;
}

const UpdateBarExercise: React.FC<UpdateBarExerciseProps> = ({
  barExerciseData,
}) => {
  const theme = useTheme();
  const [plates, setPlates] = React.useState(
    platesForWeight((barExerciseData.weight.value - 45) / 2),
  );
  const [warmup, setWarmup] = React.useState(barExerciseData.warmup || false);
  const [reps, setReps] = React.useState(barExerciseData.reps);
  const [open, setOpen] = React.useState(false);
  const api = usePlates(plates, setPlates);

  const deleteExercise = useDeleteExercise();
  const updateExercise = useUpdateBarExercise();

  return (
    <>
      <Typography>
        Editing {exerciseUIString(fromDBExercise(barExerciseData.type))}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Bar plates={plates} />
      </Box>
      <AddPlates api={api} />
      <span
        css={css`
          ${repsAndWarmupRowCss};
          margin-top: ${theme.spacing(1)};
          margin-bottom: ${theme.spacing(1)};
        `}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={warmup}
                onChange={(e) => setWarmup(e.target.checked)}
              />
            }
            label="Warmup"
          />
        </FormGroup>
        <SetReps reps={reps} setReps={setReps} />
      </span>
      <span
        css={css`
          ${buttonRowCss};
          margin-top: ${theme.spacing(2)};
        `}
      >
        <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            updateExercise(barExerciseData, {
              weight: barExerciseWeight(api.plateCounts),
              reps,
              warmup,
            }).then(() => {
              navigate(-1);
            });
          }}
        >
          Update
        </Button>
      </span>

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this exercise?
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              deleteExercise(barExerciseData).then(() => {
                setOpen(false);
                navigate(-1);
              });
            }}
          >
            Yes, Delete
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateBarExercise;
