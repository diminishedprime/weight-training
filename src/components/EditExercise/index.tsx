import { css, Link, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import { BounceLoader } from 'react-spinners';
import { StringParam, useQueryParam } from 'use-query-params';
import { ExerciseData, isBarExercise, WithID } from '@/types';
import UpdateBarExercise from './UpdateBarExercise';
import useExercise from './useExercise';
import { fromDBExercise } from '@/util';

export enum QueryParam {
  ExerciseID = 'a',
}

export const editExerciseUrlFor = (e: WithID<ExerciseData>): string =>
  `/edit-exercise?${QueryParam.ExerciseID}=${e.id}`;

const spinnerCss = css`
  display: block;
  margin: auto;
`;

const EditExercise: React.FC = () => {
  const [id] = useQueryParam(QueryParam.ExerciseID, StringParam);
  const theme = useTheme();

  const request = useExercise(id);

  if (id === undefined) {
    return (
      <Typography>
        This page requires a exercise id query parameter. You probably ended up
        here in errror. <Link href="/">Go home</Link>.{' '}
      </Typography>
    );
  }

  if (request.type === 'in-progress') {
    return <BounceLoader color={theme.palette.primary.main} css={spinnerCss} />;
  }

  if (
    request.type === 'resolved' &&
    isBarExercise(fromDBExercise(request.exercise.type))
  ) {
    return (
      <>
        <UpdateBarExercise barExerciseData={request.exercise} />
      </>
    );
  }

  return null;
};

export default EditExercise;
