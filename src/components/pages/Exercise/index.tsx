import * as React from 'react';
import { useQueryParam } from 'use-query-params';
import { Typography, useTheme } from '@mui/material';
import { groupBy } from 'lodash';
import { useMemo } from 'react';
import { BounceLoader } from 'react-spinners';
import { css } from '@emotion/react';
import moment from 'moment';
import { ExerciseQueryParam } from '@/constants';
import ExerciseTable from '@/components/pages/Exercise/ExerciseTable';
import useExercises from '@/components/pages/Exercise/useExercises';
import AddExercise from '@/components/pages/Exercise/AddExercise';
import { exerciseUIString, narrowBarExercise } from '@/types';
import AddSetsByReps from '@/components/pages/Exercise/AddNxM';
import useActiveExercises from '@/components/pages/Exercise/useActiveExercises';

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
            moment(lift.date.toDate()).calendar(null, {
              sameDay: '[Today]',
              lastDay: '[Yesterday]',
              lastWeek: '[Last] dddd',
              sameElse: 'dddd, Do MMMM YYYY',
            }),
          )
        : {},
    [request],
  );

  const activeExercises = useActiveExercises(exercise);

  if (exercise === null || exercise === undefined) {
    return null;
  }

  return (
    <section>
      <Typography variant="h6" sx={{ ml: 1 }}>
        {exerciseUIString(exercise)}
      </Typography>
      {narrowBarExercise(exercise) && (
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
      {narrowBarExercise(exercise) && (
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
