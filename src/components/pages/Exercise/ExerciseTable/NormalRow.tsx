import { Check } from '@mui/icons-material';
import { css, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import TimeSince from '@/components/common/TimeSince';
import { BarExerciseData, ExerciseData, narrowBarExercise } from '@/types';
import { fromDBExercise } from '@/util';

interface NormalRowProps {
  editing: boolean;
  showEllapsedTime: boolean;
  showWarmup: boolean;
  setEditing: (editing: boolean) => void;
  exercise: ExerciseData;
}

const editingCss = css`
  border-bottom: none;
`;

const NormalRow: React.FC<NormalRowProps> = ({
  editing,
  setEditing,
  showEllapsedTime,
  exercise,
  showWarmup,
}) => (
  //
  <TableRow
    onClick={() => {
      setEditing(!editing);
    }}
  >
    <TableCell css={editing ? editingCss : undefined}>
      {showEllapsedTime ? (
        <TimeSince date={exercise.date} />
      ) : (
        exercise.date.toDate().toLocaleTimeString()
      )}
    </TableCell>
    <TableCell align="right" css={editing ? editingCss : undefined}>
      {exercise.weight.value}
      {exercise.weight.unit}
    </TableCell>
    <TableCell align="right" css={editing ? editingCss : undefined}>
      {exercise.reps}
    </TableCell>
    {showWarmup && (
      <TableCell css={editing ? editingCss : undefined}>
        {narrowBarExercise(fromDBExercise(exercise.type)) &&
          (exercise as BarExerciseData).warmup && (
            <Check sx={{ fontSize: '1rem' }} />
          )}
      </TableCell>
    )}
  </TableRow>
);
export default NormalRow;
