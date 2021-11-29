import * as React from 'react';
import { Button, ButtonGroup, FormLabel } from '@mui/material';
import { useCallback } from 'react';

interface SetRepsProps {
  setReps: React.Dispatch<React.SetStateAction<number>>;
  reps: number;
}

const SetReps: React.FC<SetRepsProps> = ({ reps, setReps }) => {
  const subtractRep = useCallback(() => {
    setReps((a) => Math.max(1, a - 1));
  }, [setReps]);
  const addRep = useCallback(() => {
    setReps((a) => Math.min(20, a + 1));
  }, [setReps]);

  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <FormLabel>Reps: {reps}</FormLabel>
      <ButtonGroup>
        <Button disabled={reps === 1} onClick={subtractRep}>
          -
        </Button>
        <Button
          color={reps === 1 ? 'primary' : undefined}
          variant={reps === 1 ? 'contained' : undefined}
          onClick={() => setReps(1)}
        >
          1
        </Button>
        <Button
          color={reps === 3 ? 'primary' : undefined}
          variant={reps === 3 ? 'contained' : undefined}
          onClick={() => setReps(3)}
        >
          3
        </Button>
        <Button
          color={reps === 5 ? 'primary' : undefined}
          variant={reps === 5 ? 'contained' : undefined}
          onClick={() => setReps(5)}
        >
          5
        </Button>
        <Button
          color={reps === 10 ? 'primary' : undefined}
          variant={reps === 10 ? 'contained' : undefined}
          onClick={() => setReps(10)}
        >
          10
        </Button>
        <Button disabled={reps === 20} onClick={addRep}>
          +
        </Button>
      </ButtonGroup>
    </span>
  );
};

export default SetReps;
