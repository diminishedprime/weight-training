import {
  css,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { ExerciseData, narrowBarExercise, WithID } from '@/types';
import { fromDBExercise } from '@/util';
import NormalRow from '@/components/pages/Exercise/ExerciseTable/NormalRow';
import DetailRow from '@/components/pages/Exercise/ExerciseTable/DetailRow';
import { DumbbellAPI } from '@/components/pages/Exercise/AddExercise/useDumbbellWeight';
import { PlatesAPI } from '@/components/pages/Exercise/usePlates';

const editingCss = css`
  border-bottom: none;
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

interface ExerciseTableProps {
  exercises: WithID<ExerciseData>[];
  showEllapsedTime: boolean;
  heading?: string;
  loadBar: PlatesAPI['loadToWeight'];
  loadWeight: DumbbellAPI['setWeight'];
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
  exercises,
  showEllapsedTime,
  loadBar,
  loadWeight,
  heading = undefined,
}) => {
  const [editingIdx, setEditingIdx] = useState(-1);
  const showWarmup = useMemo(
    () => exercises.find((e) => narrowBarExercise(fromDBExercise(e.type))),
    [exercises],
  );
  const setEditing = React.useCallback(
    (idx: number) => (e: boolean) => {
      if (!e) {
        setEditingIdx(-1);
      } else {
        setEditingIdx(idx);
      }
    },
    [setEditingIdx],
  );
  return (
    <>
      <TableContainer sx={{ mb: 2, mt: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell colSpan={4} align="center" css={editingCss}>
                {heading}
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell align="right">Weight</StyledTableCell>
              <StyledTableCell align="right">Reps</StyledTableCell>
              {showWarmup && <StyledTableCell>Warmup</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.map((exercise, idx) => (
              <React.Fragment key={exercise.date.toDate().toLocaleTimeString()}>
                <NormalRow
                  editing={editingIdx === idx}
                  showEllapsedTime={showEllapsedTime && idx === 0}
                  exercise={exercise}
                  showWarmup={!!showWarmup}
                  setEditing={setEditing(idx)}
                />
                {editingIdx === idx && (
                  <DetailRow
                    exercise={exercise}
                    loadWeight={loadWeight}
                    loadBar={loadBar}
                  />
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ExerciseTable;
