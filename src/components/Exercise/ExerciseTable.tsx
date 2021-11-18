import { Check } from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { ExerciseData } from '@/types';

interface ExerciseTableProps {
  lifts: ExerciseData[];
  heading?: string;
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
  lifts,
  heading = undefined,
}) => (
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
          {lifts.map((lift) => (
            <TableRow key={lift.date.toDate().toLocaleTimeString()}>
              <TableCell>{lift.date.toDate().toLocaleTimeString()}</TableCell>
              <TableCell align="right">
                {lift.weight.value}
                {lift.weight.unit}
              </TableCell>
              <TableCell align="right">{lift.reps}</TableCell>
              <TableCell>
                {lift.warmup && <Check sx={{ fontSize: '1rem' }} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default ExerciseTable;
