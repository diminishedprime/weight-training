import { Check } from '@mui/icons-material';
import {
  Button,
  css,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { ExerciseData, WithID } from '@/types';
import TimeSince from '../TimeSince';
import { editExerciseUrlFor } from '../EditExercise';

const editingCss = css`
  border-bottom: none;
`;

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
      {heading && <Typography variant="h6">{heading}</Typography>}
      <TableContainer sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell align="right">Weight</TableCell>
              <TableCell align="right">Reps</TableCell>
              <TableCell>Warmup</TableCell>
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
