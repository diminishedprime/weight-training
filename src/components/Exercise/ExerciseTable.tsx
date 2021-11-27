import { Check } from '@mui/icons-material';
import {
  Button,
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
import React, { useState } from 'react';
import { ExerciseData, WithID } from '@/types';
import TimeSince from '../TimeSince';
import { editExerciseUrlFor } from '../EditExercise';

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
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
  exercises: lifts,
  showEllapsedTime,
  heading = undefined,
}) => {
  const [editing, setEditing] = useState(-1);
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
              <StyledTableCell>Warmup</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lifts.map((lift, idx) => (
              <React.Fragment key={lift.date.toDate().toLocaleTimeString()}>
                <TableRow
                  onClick={() =>
                    editing === idx ? setEditing(-1) : setEditing(idx)
                  }
                >
                  <TableCell css={editing === idx ? editingCss : undefined}>
                    {showEllapsedTime && idx === 0 ? (
                      <TimeSince date={lift.date} />
                    ) : (
                      lift.date.toDate().toLocaleTimeString()
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    css={editing === idx ? editingCss : undefined}
                  >
                    {lift.weight.value}
                    {lift.weight.unit}
                  </TableCell>
                  <TableCell
                    align="right"
                    css={editing === idx ? editingCss : undefined}
                  >
                    {lift.reps}
                  </TableCell>
                  <TableCell css={editing === idx ? editingCss : undefined}>
                    {lift.warmup && <Check sx={{ fontSize: '1rem' }} />}
                  </TableCell>
                </TableRow>
                {editing === idx && (
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        href={editExerciseUrlFor(lift)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
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
