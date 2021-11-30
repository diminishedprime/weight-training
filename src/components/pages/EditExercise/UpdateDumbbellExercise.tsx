import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { navigate } from 'gatsby';
import * as React from 'react';
import useDeleteExercise from '@/components/pages/EditExercise/useDeleteExercise';
import SetReps from '@/components/pages/Exercise/SetReps';
import { DumbbellExerciseData, exerciseUIString, WithID } from '@/types';
import { fromDBExercise } from '@/util';
import Dumbbell from '@/components/common/Dumbbell';
import useDumbbellWeight from '@/components/pages/Exercise/AddExercise/useDumbbellWeight';
import useUpdateDumbbellExercise from '@/components/pages/EditExercise/useUpdateDumbbellExercise';

interface UpdateBarExerciseProps {
  dumbbellExerciseData: WithID<DumbbellExerciseData>;
}

const UpdateBarExercise: React.FC<UpdateBarExerciseProps> = ({
  dumbbellExerciseData,
}) => {
  const [reps, setReps] = React.useState(dumbbellExerciseData.reps);
  const [open, setOpen] = React.useState(false);

  const deleteExercise = useDeleteExercise();
  const updateExercise = useUpdateDumbbellExercise();

  const [weight, setWeight] = React.useState(dumbbellExerciseData.weight);
  const weightAPI = useDumbbellWeight(setWeight);

  return (
    <>
      <Typography>
        Editing {exerciseUIString(fromDBExercise(dumbbellExerciseData.type))}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Button variant="outlined" onClick={weightAPI.bumpDown}>
          Weight Down
        </Button>
        <Dumbbell weight={weight} viewportWidth={30} />
        <Button variant="outlined" onClick={weightAPI.bumpUp}>
          Weight Up
        </Button>
      </Box>
      <SetReps reps={reps} setReps={setReps} />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            updateExercise(dumbbellExerciseData, {
              weight,
              reps,
            }).then(() => {
              navigate(-1);
            });
          }}
        >
          Update
        </Button>
      </Box>

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
              deleteExercise(dumbbellExerciseData).then(() => {
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
