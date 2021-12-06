import { Box, Button, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import { editExerciseUrlFor } from '@/components/pages/EditExercise';
import { DumbbellAPI } from '@/components/pages/Exercise/AddExercise/useDumbbellWeight';
import { PlatesAPI } from '@/components/pages/Exercise/usePlates';
import {
  ExerciseData,
  narrowBarExercise,
  narrowDumbbellExercise,
  WithID,
} from '@/types';
import { fromDBExercise } from '@/util';

interface DetailRowProps {
  exercise: WithID<ExerciseData>;
  loadBar: PlatesAPI['loadToWeight'];
  loadWeight: DumbbellAPI['setWeight'];
}

const DetailRow: React.FC<DetailRowProps> = ({
  exercise,
  loadBar,
  loadWeight,
}) => {
  const isBarExercise = narrowBarExercise(fromDBExercise(exercise.type));
  const isDumbbellExercise = narrowDumbbellExercise(
    fromDBExercise(exercise.type),
  );
  console.log({ isDumbbellExercise, isBarExercise });
  return (
    <TableRow>
      <TableCell colSpan={4}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {isBarExercise && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => loadBar(exercise.weight)}
            >
              Load Bar
            </Button>
          )}
          {isDumbbellExercise && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => loadWeight(exercise.weight)}
            >
              Load Weight
            </Button>
          )}
          <Button
            variant="outlined"
            color="warning"
            size="small"
            href={editExerciseUrlFor(exercise)}
          >
            Edit
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default DetailRow;
