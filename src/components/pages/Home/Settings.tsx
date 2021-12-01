import { Settings as SettingsIcon } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { Exercise, exerciseUIString, UserDoc_V4 } from '@/types';
import useUpdateUserDoc from '@/firebase/hooks/useUpdateUserDoc';

interface SettingsProps {
  userDoc: UserDoc_V4;
}

interface Option {
  exercise: Exercise;
  uiString: string;
}

const exerciseToOption = (exercise: Exercise): Option => ({
  exercise,
  uiString: exerciseUIString(exercise),
});

const Settings: React.FC<SettingsProps> = ({ userDoc }) => {
  const [show, setShow] = useState(false);
  const [localPinned, setLocalPinned] = useState(userDoc.pinnedExercises);
  const updateUserDoc = useUpdateUserDoc();

  const save = React.useCallback(() => {
    updateUserDoc({ pinnedExercises: localPinned }).then(() => {
      setShow(false);
    });
  }, [localPinned, updateUserDoc]);

  return (
    <>
      <IconButton onClick={() => setShow(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog fullWidth onClose={() => setShow(false)} open={show}>
        <DialogTitle>Pinned Exercises</DialogTitle>
        <DialogContent>
          <Autocomplete<Option, true, true, false>
            sx={{ my: 1 }}
            disableCloseOnSelect
            filterSelectedOptions
            multiple
            value={
              localPinned.type === 'unset'
                ? []
                : localPinned.exercises.map(exerciseToOption)
            }
            isOptionEqualToValue={(option, value) =>
              option.exercise === value.exercise
            }
            onChange={(_e, value, _reason) => {
              setLocalPinned({
                type: 'set',
                exercises: value.map((v) => v.exercise),
              });
            }}
            options={Object.values(Exercise).map(exerciseToOption)}
            getOptionLabel={(e) => e.uiString}
            renderOption={(props, option) => (
              <li {...props}>
                <Box key={option.exercise} sx={{ p: 1 }}>
                  {option.uiString}
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Pinned Exercises" />
            )}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Button variant="contained" color="primary" onClick={save}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Settings;
