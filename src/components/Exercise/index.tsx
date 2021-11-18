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

  return (
    <section>
      <Typography variant="h6" sx={{ ml: 1 }}>
        {exerciseUIString(exercise)}
      </Typography>
      {request.type === 'in-progress' && (
        <BounceLoader color={theme.palette.primary.main} css={spinnerCss} />
      )}
      {Object.entries(grouped).map(([k, v]) => (
        <ExerciseTable key={k} lifts={v} heading={k} />
      ))}
    </section>
  );
};

export default Exercise;
