import { Check } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
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
import Bar from '@/components/Bar';
import TimeSince from '@/components/TimeSince';
import { BarExercise, Reps, Sets } from '@/types';
import { platesForWeight } from '../usePlates';
import useSetsByReps from './useSetsByReps';

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
                label="Working Weight"
                value={api.targetWeight || ''}
                onChange={(e) => api.setTargetWeight(e.target.value)}
                helperText={
                  parseInt(api.targetWeight, 10) &&
                  parseInt(api.targetWeight, 10) % 5 !== 0
                    ? 'Rounds to nearest 5lbs.'
                    : undefined
                }
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <FormControl sx={{ mr: 1, mt: 1 }}>
                <FormLabel>Warmup Type</FormLabel>
                <RadioGroup
                  row
                  value={api.warmupSet.type}
                  onChange={(_, value) => {
                    api.setWarmupType(value as typeof api['warmupSet']['type']);
                  }}
                >
                  <FormControlLabel
                    value="percentage"
                    control={<Radio size="small" />}
                    label="Percentage"
                  />
                  <FormControlLabel
                    value="even"
                    control={<Radio size="small" />}
                    label="Even"
                  />
                </RadioGroup>
              </FormControl>
              {api.warmupSet.type === 'even' && (
                <FormControl sx={{ mt: 1 }}>
                  <FormLabel>Warmup Sets</FormLabel>
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Button
                      sx={{ px: 0, minWidth: 48 }}
                      size="small"
                      variant="outlined"
                      disabled={api.warmupSet.warmupSets === 0}
                      onClick={() =>
                        api.warmupSet.type === 'even' &&
                        api.setWarmupSets(api.warmupSet.warmupSets - 1)
                      }
                    >
                      -
                    </Button>
                    <Typography sx={{ mx: 1 }}>
                      {api.warmupSet.warmupSets}
                    </Typography>
                    <Button
                      sx={{ px: 0, minWidth: 48 }}
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        api.warmupSet.type === 'even' &&
                        api.setWarmupSets(api.warmupSet.warmupSets + 1)
                      }
                    >
                      +
                    </Button>
                  </Box>
                </FormControl>
              )}
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              {cancel}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={api.targetWeight === ''}
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
