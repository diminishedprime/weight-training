import * as React from 'react';
import { useQueryParam } from 'use-query-params';
import { Button, Typography, useTheme } from '@mui/material';
import { groupBy } from 'lodash';
import { useMemo } from 'react';
import { BounceLoader } from 'react-spinners';
import { css } from '@emotion/react';
import { Add } from '@mui/icons-material';
import { ExerciseQueryParam } from '@/constants';
import { exerciseUIString, nameForExercise } from '@/util';
import ExerciseTable from './ExerciseTable';
import useExercises from './useExercises';
import AddExercise from './AddExercise';
import usePersistentBoolean, { BooleanKey } from '@/hooks/usePersistentBoolean';

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
  const [showAdd, setShowAdd] = usePersistentBoolean(
    BooleanKey.ShowAddCustom,
    false,
    nameForExercise(exercise),
  );

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
      {!showAdd && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setShowAdd(true)}
        >
          Custom
        </Button>
      )}
      {showAdd && (
        <AddExercise exercise={exercise} onCancel={() => setShowAdd(false)} />
      )}
      {request.type === 'in-progress' && (
        <BounceLoader color={theme.palette.primary.main} css={spinnerCss} />
      )}
      {Object.entries(grouped).map(([k, v], idx) => (
        <ExerciseTable
          key={k}
          lifts={v}
          heading={k}
          showEllapsedTime={idx === 0}
        />
      ))}
    </section>
  );
};

export default Exercise;
