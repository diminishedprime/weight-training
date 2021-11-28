import * as React from 'react';
import { useQueryParam } from 'use-query-params';
import { Typography, useTheme } from '@mui/material';
import { groupBy } from 'lodash';
import { useMemo } from 'react';
import { BounceLoader } from 'react-spinners';
import { css } from '@emotion/react';
import { ExerciseQueryParam } from '@/constants';
import { exerciseUIString } from '@/util';
import ExerciseTable from './ExerciseTable';
import useExercises from './useExercises';
import AddExercise from './AddExercise';
import { isBarExercise } from '@/types';
import AddSetsByReps from './AddNxM';
import useActiveExercises from './useActiveExercises';

export enum QueryParam {
  LiftType = 'a',
}

const spinnerCss = css`
  display: block;
  margin: auto;
`;

const Exercise: React.FC = () => {
  const [exercise] = useQueryParam(QueryParam.LiftType, ExerciseQueryParam);
  const theme = useTheme();
  const request = useExercises(exercise);

  const grouped = useMemo(
    () =>
      request.type === 'resolved'
        ? groupBy(request.exercises, (lift) =>
            lift.date.toDate().toLocaleDateString().substring(0, 10),
          )
        : {},
    [request],
  );

  const activeExercises = useActiveExercises(exercise);

  return (
    <section>
      <Typography variant="h6" sx={{ ml: 1 }}>
        {exerciseUIString(exercise)}
      </Typography>
      {isBarExercise(exercise) && (
        <AddSetsByReps
          exercise={exercise}
          sets={3}
          reps={3}
          ormRatio={0.9}
          noneStarted={activeExercises.noneStarted}
          active={activeExercises.isActive(3, 3)}
          onCancel={() => activeExercises.setInactive(3, 3)}
          onStart={() => activeExercises.setActive(3, 3)}
        />
      )}
      {isBarExercise(exercise) && (
        <AddSetsByReps
          exercise={exercise}
          sets={5}
          reps={5}
          ormRatio={0.8}
          noneStarted={activeExercises.noneStarted}
          active={activeExercises.isActive(5, 5)}
          onCancel={() => activeExercises.setInactive(5, 5)}
          onStart={() => activeExercises.setActive(5, 5)}
        />
      )}
      <AddExercise
        noneStarted={activeExercises.noneStarted}
        exercise={exercise}
        onCancel={activeExercises.setAddExerciseInactive}
        onStart={activeExercises.setAddExerciseActive}
        active={activeExercises.isAddVisible()}
      />
      {request.type === 'in-progress' && (
        <BounceLoader color={theme.palette.primary.main} css={spinnerCss} />
      )}
      {Object.entries(grouped).map(([k, v], idx) => (
        <ExerciseTable
          key={k}
          exercises={v}
          heading={k}
          showEllapsedTime={idx === 0}
        />
      ))}
    </section>
  );
};

export default Exercise;
