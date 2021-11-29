import { css, Link, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import { BounceLoader } from 'react-spinners';
import { StringParam, useQueryParam } from 'use-query-params';
import UpdateBarExercise from '@/components/pages/EditExercise/UpdateBarExercise';
import useExercise from '@/components/pages/EditExercise/useExercise';
import {
  BarExerciseData,
  DumbbellExerciseData,
  ExerciseData,
  narrowBarExercise,
  narrowDumbbellExercise,
  WithID,
} from '@/types';
import { fromDBExercise } from '@/util';
import UpdateDumbbellExercise from '@/components/pages/EditExercise/UpdateDumbbellExercise';

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

  if (request.type === 'resolved') {
    if (narrowBarExercise(fromDBExercise(request.exercise.type))) {
      return (
        <UpdateBarExercise
          barExerciseData={request.exercise as WithID<BarExerciseData>}
        />
      );
    }
    if (narrowDumbbellExercise(fromDBExercise(request.exercise.type))) {
      return (
        <UpdateDumbbellExercise
          dumbbellExerciseData={
            request.exercise as WithID<DumbbellExerciseData>
          }
        />
      );
    }
  }

  return null;
};

export default EditExercise;
