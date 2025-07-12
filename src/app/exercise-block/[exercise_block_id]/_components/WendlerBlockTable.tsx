"use client";
import * as React from "react";

import { Stack, Typography, Paper } from "@mui/material";
import type { WendlerBlock, WendlerMetadata } from "@/common-types";
import {
  completionStatusUIString,
  exerciseTypeUIStringLong,
  wendlerCycleUIString,
} from "@/uiStrings";
import WendlerBlockRowActive from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockRowActive";

export interface WendlerBlockTableProps {
  block: WendlerBlock;
  metadata: WendlerMetadata;
}

// TODO - this is the next big thing to work on. Want to make this ui _really_
// easy to use for marking exercises as completed or slightly modified.

// TODO - There should be edit buttons that do dynamic ui that let stuff be
// editable, for example, the weight should use the cute render of the bar, but
// edit should make it use the barbell editor.

// TODO - make a new component to show a weight with good uistrings, etc.

const WendlerBlockTable: React.FC<WendlerBlockTableProps> = ({
  block,
  metadata,
}) => {
  if (!block || block.length === 0) {
    return <Typography>No exercises found for this block.</Typography>;
  }
  return (
    <Paper sx={{ p: 1 }}>
      <Stack spacing={1}>
        {/* Metadata summary */}
        <Typography variant="h4">{metadata.block_name}</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            <strong>Wendler Cycle:</strong>{" "}
            {wendlerCycleUIString(metadata.cycle_type!)}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <strong>Training Max:</strong> {metadata.training_max_value}{" "}
            {metadata.training_max_unit}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <strong>Increase:</strong> {metadata.increase_amount_value}{" "}
            {metadata.increase_amount_unit}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            <strong>Exercise:</strong>{" "}
            {exerciseTypeUIStringLong(metadata.exercise_type!)}
          </Typography>
        </Stack>
        {block.map((row, idx) =>
          row.exercise_id === metadata.active_exercise_id ? (
            <WendlerBlockRowActive
              key={row.exercise_id}
              row={row}
              isLastRow={idx === block.length - 1}
            />
          ) : (
            <WendlerBlockRowInactive key={row.exercise_id} row={row} />
          )
        )}
      </Stack>
    </Paper>
  );
};

interface WendlerBlockRowProps {
  row: WendlerBlock[number];
}

const WendlerBlockRowInactive: React.FC<WendlerBlockRowProps> = ({ row }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 2fr",
      gap: 1,
      px: 1,
      py: 0.5,
      borderRadius: 1,
      bgcolor: "background.paper",
      border: 1,
      borderColor: "grey.300",
      mb: 1,
      cursor: "pointer",
    }}
    data-testid="wendler-row">
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Typography>{row.weight_value}</Typography>
      <Typography variant="body2" color="text.secondary">
        ({row.actual_weight_value})
      </Typography>
    </Stack>
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Typography>{row.reps}</Typography>
      {row.is_amrap && (
        <Typography variant="caption" color="primary" sx={{ ml: 0.5 }}>
          (AMRAP)
        </Typography>
      )}
    </Stack>
    <Typography color={row.warmup ? "warning" : "success"}>
      {row.warmup ? "Warmup" : "Working Set"}
    </Typography>
    <Typography>{completionStatusUIString(row.completion_status!)}</Typography>
    <Typography sx={{ whiteSpace: "pre-line" }}>{row.notes || ""}</Typography>
  </Stack>
);

export default WendlerBlockTable;
