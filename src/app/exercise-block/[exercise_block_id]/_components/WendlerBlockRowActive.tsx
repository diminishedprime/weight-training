"use client";
import * as React from "react";
import { Stack, TextField, Typography } from "@mui/material";
import SelectPercievedEffort from "@/components/select/SelectPercievedEffort";
import SelectReps from "@/components/select/SelectReps";
import SelectCompletionStatus from "@/components/select/SelectCompletionStatus";
import type {
  CompletionStatus,
  PercievedEffort,
  WendlerBlock,
} from "@/common-types";

interface WendlerBlockRowActiveProps {
  row: WendlerBlock[number];
  isLastRow?: boolean;
}

const useWendlerBlockRowActiveAPI = (props: WendlerBlockRowActiveProps) => {
  const { row } = props;
  // These fields are not nullable in UI usage
  const [reps, setReps] = React.useState<number>(row.reps!);
  const [completionStatus, setCompletionStatus] =
    React.useState<CompletionStatus>(row.completion_status!);
  const [notes, setNotes] = React.useState<string>(row.notes || "");
  const [percievedEffort, setPercievedEffort] =
    React.useState<PercievedEffort | null>(row.relative_effort ?? null);

  const onRepsChange = React.useCallback((newReps: number) => {
    setReps(newReps);
  }, []);

  const onCompletionStatusChange = React.useCallback(
    (newStatus: CompletionStatus) => {
      setCompletionStatus(newStatus);
    },
    []
  );

  const onNotesChange = React.useCallback((newNotes: string) => {
    setNotes(newNotes);
  }, []);

  const onPercievedEffortChange = React.useCallback(
    (percievedEffort: PercievedEffort | null) => {
      setPercievedEffort(percievedEffort);
    },
    []
  );

  const modifiedRow = React.useMemo(() => {
    return {
      ...row,
      reps,
      completion_status: completionStatus,
      notes,
      relative_effort: percievedEffort,
    };
  }, [row, reps, completionStatus, notes, percievedEffort]);

  return {
    reps,
    completionStatus,
    notes,
    relativeEffort: percievedEffort,
    onRepsChange,
    onCompletionStatusChange,
    onNotesChange,
    onEffortChange: onPercievedEffortChange,
    modifiedRow,
  };
};

const WendlerBlockRowActive: React.FC<WendlerBlockRowActiveProps> = (props) => {
  const api = useWendlerBlockRowActiveAPI(props);
  const { row } = props;

  return (
    <Stack
      spacing={1}
      sx={{
        px: 1,
        py: 0.5,
        borderRadius: 1,
        border: 2,
        borderColor: "primary.main",
      }}
      data-testid="active-wendler-row">
      <Typography variant="body2" color="primary">
        <b>Current Set</b>
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 2fr",
          gap: 1,
        }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body1">{row.weight_value}</Typography>
          <Typography variant="body2" color="text.secondary">
            ({row.actual_weight_value})
          </Typography>
        </Stack>
        <SelectReps
          reps={api.reps}
          onRepsChange={api.onRepsChange}
          wendlerReps
          isAmrap={props.isLastRow}
          hideSettings
        />
        <SelectPercievedEffort
          percievedEffort={api.relativeEffort}
          onPercievedEffortChange={api.onEffortChange}
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <TextField
          label="Notes"
          multiline
          minRows={2}
          value={api.notes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            api.onNotesChange(e.target.value)
          }
          sx={{ flexGrow: 1 }}
        />
        <SelectCompletionStatus
          customLabel="Finish Set"
          completionStatus={api.completionStatus}
          onCompletionStatusChange={api.onCompletionStatusChange}
        />
      </Stack>
    </Stack>
  );
};

export default WendlerBlockRowActive;
