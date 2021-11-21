import { Add } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  css,
  FormControlLabel,
  FormGroup,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { Timestamp } from 'firebase/firestore';
import usePersistentNumber, { NumberKey } from '@/hooks/usePersistentNumber';
import { Exercise, ExerciseData } from '@/types';
import { nameForExercise } from '@/util';
import Bar from '../Bar';
import AddPlates from './AddPlates';
import SetReps from './SetReps';
import usePlates from './usePlates';
import usePersistentBoolean, { BooleanKey } from '@/hooks/usePersistentBoolean';
import useAddExercise from './useAddExercise';

const exerciseCss = css`
  display: flex;
  flex-direction: column;
`;

const repsAndWarmupRowCss = css`
  display: flex;
  align-items: end;
  justify-content: space-around;
`;

const addCss = css`
  display: flex;
  & > span {
    flex-grow: 1;
  }
`;

interface AddExerciseProps {
  exercise: Exercise;
  onCancel: () => void;
}

const AddExercise: React.FC<AddExerciseProps> = ({ exercise, onCancel }) => {
  const theme = useTheme();
  const [warmup, setWarmup] = usePersistentBoolean(
    BooleanKey.Warmup,
    false,
    `${nameForExercise(exercise)}/warmup`,
  );
  const [reps, setReps] = usePersistentNumber(
    NumberKey.Reps,
    1,
    `add-lift/${nameForExercise(exercise)}`,
  );

  const platesAPI = usePlates(nameForExercise(exercise));

  const addExercise = useAddExercise();

  const getExerciseData = React.useCallback((): ExerciseData => {
    switch (exercise) {
      case Exercise.Snatch:
        return {
          type: 'snatch',
          date: Timestamp.now(),
          reps,
          version: 1,
          weight: {
            unit: 'lb',
            value:
              platesAPI.plates.reduce((acc, p) => acc + p.value, 0) * 2 + 45,
            version: 1,
          },
        };
      default:
        throw new Error('Exercise type not supported');
    }
  }, [platesAPI, exercise, reps]);

  return (
    <section css={exerciseCss}>
      <Bar plates={platesAPI.plates} />
      <AddPlates api={platesAPI} />
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
      <span css={addCss}>
        <Button
          variant="outlined"
          color="error"
          sx={{ mr: 1, mt: 1 }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <span />
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ mr: 1, mt: 1 }}
          onClick={() => addExercise(getExerciseData())}
        >
          Add
        </Button>
      </span>
    </section>
  );
};

export default AddExercise;
