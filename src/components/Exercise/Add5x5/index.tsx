import { Check } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControlLabel,
  Paper,
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
import { BarExercise } from '@/types';
import { platesForWeight } from '../usePlates';
import use5x5 from './use5x5';

interface Add5x5Props {
  exercise: BarExercise;
  onCancel: () => void;
}

const CurrentCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.primary.main,
  border: 'none',
}));

const Add5x5: React.FC<Add5x5Props> = ({ exercise, onCancel }) => {
  const api = use5x5(exercise);
  const { cancel: apiCancel } = api;

  const cancel = React.useMemo(
    () => (
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => {
          apiCancel();
          onCancel();
        }}
      >
        cancel
      </Button>
    ),
    [apiCancel, onCancel],
  );

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        5x5
      </Typography>
      {api.status === 'not-started' && (
        <Paper sx={{ p: 1 }}>
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
          {api.warmupSet.type === 'even' && (
            <TextField
              size="small"
              value={api.warmupSet.warmupSets}
              label="Warmup Sets"
            />
          )}
          <Box sx={{ display: 'flex', mt: 1 }}>
            {cancel}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={api.start5x5}
            >
              Start
            </Button>
          </Box>
        </Paper>
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
                            plates={platesForWeight((s.weight.value - 45) / 2)}
                          />
                        </CurrentCell>
                      </TableRow>
                    )}
                    {api.currentSet === idx && (
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
};

export default Add5x5;
