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
import {
  MachineExerciseData,
  exerciseUIString,
  WithID,
  Exercise,
} from '@/types';
import { fromDBExercise } from '@/util';
import MachineStack from '@/components/common/MachineStack';
import useMachineWeight from '@/components/pages/Exercise/AddExercise/useMachineWeight';
import useUpdateMachineExercise from '@/components/pages/EditExercise/useUpdateMachineExercise';

interface UpdateMachineExerciseProps {
  machineExerciseData: WithID<MachineExerciseData>;
}

const UpdateMachineExercise: React.FC<UpdateMachineExerciseProps> = ({
  machineExerciseData,
}) => {
  const [reps, setReps] = React.useState(machineExerciseData.reps);
  const [open, setOpen] = React.useState(false);

  const deleteExercise = useDeleteExercise();
  const updateExercise = useUpdateMachineExercise();

  const [weight, setWeight] = React.useState(machineExerciseData.weight);
  const machineAPI = useMachineWeight(
    weight,
    setWeight,
    machineExerciseData.type as Exercise,
  );

  return (
    <>
      <Typography>
        Editing {exerciseUIString(fromDBExercise(machineExerciseData.type))}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Button variant="outlined" onClick={machineAPI.bumpDown}>
          Weight Down
        </Button>
        <MachineStack machineAPI={machineAPI} />
        <Button variant="outlined" onClick={machineAPI.bumpUp}>
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
            updateExercise(machineExerciseData, {
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
              deleteExercise(machineExerciseData).then(() => {
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

export default UpdateMachineExercise;
