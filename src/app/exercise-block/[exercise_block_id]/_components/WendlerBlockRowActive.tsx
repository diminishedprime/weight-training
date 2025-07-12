"use client";
import * as React from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { EffortEditor } from "@/components/EffortEditor";
import RepsSelector from "@/components/RepsSelector";
import type { CompletionStatus, WendlerBlock } from "@/common-types";
import CompletionStatusSelector from "@/components/CompletionStatusSelector";

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
  const [relativeEffort, setRelativeEffort] = React.useState<
    import("@/common-types").RelativeEffort | null
  >(row.relative_effort ?? null);

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

  const onEffortChange = React.useCallback(
    (effort: import("@/common-types").RelativeEffort) => {
      setRelativeEffort(effort);
    },
    []
  );

  const modifiedRow = React.useMemo(() => {
    return {
      ...row,
      reps,
      completion_status: completionStatus,
      notes,
      relative_effort: relativeEffort,
    };
  }, [row, reps, completionStatus, notes, relativeEffort]);

  return {
    reps,
    completionStatus,
    notes,
    relativeEffort,
    onRepsChange,
    onCompletionStatusChange,
    onNotesChange,
    onEffortChange,
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
        <RepsSelector
          reps={api.reps}
          onChange={api.onRepsChange}
          wendlerReps
          isAmrap={props.isLastRow}
          hideSettings
        />
        <EffortEditor
          value={api.relativeEffort}
          onChange={api.onEffortChange}
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
        <CompletionStatusSelector
          customLabel="Finish Set"
          value={api.completionStatus}
          onChange={api.onCompletionStatusChange}
        />
      </Stack>
    </Stack>
  );
};

export default WendlerBlockRowActive;
