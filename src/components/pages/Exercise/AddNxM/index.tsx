import { Check } from '@mui/icons-material';
import {
  Box,
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import Bar from '@/components/common/Bar';
import TimeSince from '@/components/common/TimeSince';
import { BarExercise, Reps, Sets } from '@/types';
import useSetsByReps from '@/components/pages/Exercise/AddNxM/useSetsByReps';
import { nearest5, platesForWeight } from '@/util';

interface AddSetsxRepsProps {
  exercise: BarExercise;
  sets: Sets;
  reps: Reps;
  ormRatio: number;
  onCancel: () => void;
  onStart: () => void;
  noneStarted: boolean;
  active: boolean;
}

const CurrentCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.primary.main,
  border: 'none',
}));

const AddSetsByReps: React.FC<AddSetsxRepsProps> = ({
  exercise,
  sets,
  reps,
  ormRatio,
  onCancel,
  onStart,
  noneStarted,
  active,
}) => {
  const api = useSetsByReps(exercise, sets, reps, ormRatio);

  const cancel = React.useMemo(
    () => (
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => {
          api.cancel();
          onCancel();
        }}
      >
        cancel
      </Button>
    ),
    [api, onCancel],
  );

  if (noneStarted) {
    return (
      <Button variant="outlined" size="small" onClick={onStart} sx={{ mr: 1 }}>
        {sets}x{reps}
      </Button>
    );
  }

  const ormNum =
    api.status === 'not-started' && api.orm ? parseInt(api.orm, 10) : 0;

  if (active) {
    return (
      <>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {sets}x{reps}
        </Typography>
        {api.status === 'not-started' && (
          <Box sx={{ p: 1, flexDirection: 'row-reverse' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <TextField
                size="small"
                label="Target ORM"
                sx={{ mr: 1 }}
                value={api.orm || ''}
                onChange={(e) => api.setORM(e.target.value)}
                helperText={
                  parseInt(api.orm, 10) && parseInt(api.orm, 10) % 5 !== 0
                    ? 'Rounds to nearest 5lbs.'
                    : undefined
                }
              />
              <TextField
                size="small"
                label="Working Max"
                sx={{ mr: 1 }}
                value={nearest5(ormNum * 0.9)}
                disabled
              />
            </Box>
            <Box>
              <Typography>
                For Target ORM, put in your true 1-rep max (or estimated). This
                app takes care of accounting for training max, etc.
              </Typography>
            </Box>
            <table>
              <thead>
                <tr>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                </tr>
              </thead>
              <tbody>
                {ormRatio === 0.85 && (
                  <tr>
                    <td>{nearest5(ormNum * 0.9 * 0.65)}</td>
                    <td>{nearest5(ormNum * 0.9 * 0.75)}</td>
                    <td>{nearest5(ormNum * 0.9 * 0.85)}</td>
                  </tr>
                )}
                {ormRatio === 0.9 && (
                  <tr>
                    <td>{nearest5(ormNum * 0.9 * 0.7)}</td>
                    <td>{nearest5(ormNum * 0.9 * 0.8)}</td>
                    <td>{nearest5(ormNum * 0.9 * 0.9)}</td>
                  </tr>
                )}
                {ormRatio === 0.95 && (
                  <tr>
                    <td>{nearest5(ormNum * 0.9 * 0.75)}</td>
                    <td>{nearest5(ormNum * 0.9 * 0.85)}</td>
                    <td>{nearest5(ormNum * 0.9 * 0.95)}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <Box sx={{ display: 'flex', mt: 1 }}>
              {cancel}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={api.orm === ''}
                onClick={api.startSetsByReps}
              >
                Start
              </Button>
            </Box>
          </Box>
        )}
        {api.status === 'in-progress' && (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Reps</TableCell>
                  <TableCell>Warmup</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {api.sets.map((s, idx) => {
                  const Cell =
                    api.currentSet === idx
                      ? CurrentCell
                      : s.status === 'skipped'
                      ? TableCell
                      : s.status === 'not-started'
                      ? TableCell
                      : TableCell;
                  return (
                    <React.Fragment key={idx}>
                      <TableRow>
                        <Cell>
                          {s.status === 'skipped' ? (
                            'Skipped'
                          ) : s.time !== undefined &&
                            api.currentSet - 1 === idx ? (
                            <TimeSince date={s.time} />
                          ) : s.time !== undefined ? (
                            s.time.toDate().toLocaleTimeString()
                          ) : idx === api.currentSet ? (
                            'Current Set'
                          ) : (
                            ''
                          )}
                        </Cell>
                        <Cell>
                          {s.weight.value}
                          {s.weight.unit}
                        </Cell>
                        <Cell>{s.reps}</Cell>
                        <Cell>
                          {s.warmup && <Check sx={{ fontSize: '1rem' }} />}
                        </Cell>
                      </TableRow>
                      {api.currentSet === idx && (
                        <TableRow>
                          <CurrentCell colSpan={4} sx={{ padding: 0 }}>
                            <Bar
                              noText
                              plates={platesForWeight(
                                (s.weight.value - 45) / 2,
                              )}
                            />
                          </CurrentCell>
                        </TableRow>
                      )}
                      {api.status === 'in-progress' && api.currentSet === idx && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Box sx={{ display: 'flex' }}>
                              <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={api.skipLift}
                              >
                                skip
                              </Button>
                              <Box sx={{ flexGrow: 1 }} />
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={api.finishLift}
                              >
                                done
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            <Box sx={{ mt: 1 }}>{cancel}</Box>
          </>
        )}
      </>
    );
  }
  return null;
};

export default AddSetsByReps;
