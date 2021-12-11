import { Add } from '@mui/icons-material';
import {
  Box,
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
import {
  BarExerciseData,
  BarExercise,
  Exercise,
  Snatch_V1,
  Deadlift_V3,
  Squat_V3,
  FrontSquat_V3,
  BenchPress_V3,
  OverheadPress_V3,
  RomainianDeadlift_V1,
  BarbbellRow_V1,
  InclineBenchPress_V1,
} from '@/types';
import { nameForExercise } from '@/util';
import usePersistentBoolean, { BooleanKey } from '@/hooks/usePersistentBoolean';
import Bar from '@/components/common/Bar';
import AddPlates from '@/components/pages/Exercise/AddPlates';
import useAddExercise from '@/components/pages/Exercise/AddExercise/useAddExercise';
import SetReps from '@/components/pages/Exercise/SetReps';
import { PlatesAPI } from '@/components/pages/Exercise/usePlates';

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

interface AddBarExerciseProps {
  barExercise: BarExercise;
  onCancel: () => void;
  platesAPI: PlatesAPI;
}

const AddBarExercise: React.FC<AddBarExerciseProps> = ({
  barExercise,
  onCancel,
  platesAPI,
}) => {
  const theme = useTheme();
  const [warmup, setWarmup] = usePersistentBoolean(
    BooleanKey.Warmup,
    false,
    `${nameForExercise(barExercise)}/warmup`,
  );
  const [reps, setReps] = usePersistentNumber(
    NumberKey.Reps,
    1,
    `add-lift/${nameForExercise(barExercise)}`,
  );

  const addExercise = useAddExercise();

  const getBarExerciseData = React.useCallback((): BarExerciseData => {
    const basePlate: Omit<BarExerciseData, 'type' | 'version'> = {
      date: Timestamp.now(),
      reps,
      warmup,
      weight: {
        unit: 'lb',
        value: platesAPI.plates.reduce((acc, p) => acc + p.value, 0) * 2 + 45,
        version: 1,
      },
    };
    switch (barExercise) {
      case Exercise.Snatch:
        return { ...basePlate, type: 'snatch', version: 1 } as Snatch_V1;
      case Exercise.Deadlift:
        return { ...basePlate, type: 'deadlift', version: 3 } as Deadlift_V3;
      case Exercise.Squat:
        return { ...basePlate, type: 'squat', version: 3 } as Squat_V3;
      case Exercise.FrontSquat:
        return {
          ...basePlate,
          type: 'front-squat',
          version: 3,
        } as FrontSquat_V3;
      case Exercise.BenchPress:
        return {
          ...basePlate,
          type: 'bench-press',
          version: 3,
        } as BenchPress_V3;
      case Exercise.OverheadPress:
        return {
          ...basePlate,
          type: 'overhead-press',
          version: 3,
        } as OverheadPress_V3;
      case Exercise.RomainianDeadlift:
        return {
          ...basePlate,
          type: 'romanian-deadlift',
          version: 1,
        } as RomainianDeadlift_V1;
      case Exercise.BarbbellRow:
        return {
          ...basePlate,
          type: 'barbbell-row',
          version: 1,
        } as BarbbellRow_V1;
      case Exercise.InclineBenchPress:
        return {
          ...basePlate,
          type: 'incline-bench-press',
          version: 1,
        } as InclineBenchPress_V1;
      default: {
        const exhaustiveCheck: never = barExercise;
        throw new Error(`Unhandled case: ${exhaustiveCheck}`);
      }
    }
  }, [platesAPI, barExercise, reps, warmup]);

  return (
    <section css={exerciseCss}>
      <Box sx={{ mb: 2 }}>
        <Bar plates={platesAPI.plates} />
      </Box>
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
          onClick={() => addExercise(getBarExerciseData())}
        >
          Add
        </Button>
      </span>
    </section>
  );
};

export default AddBarExercise;
