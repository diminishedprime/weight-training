"use client";
import * as React from "react";

import { Stack, Typography } from "@mui/material";
import { actualWeightForTarget } from "@/util";
import {
  RoundingMode,
  type WendlerBlock,
  type WendlerMetadata,
} from "@/common-types";
import {
  completionStatusUIString,
  exerciseTypeUIStringBrief,
  weightUnitUIString,
  wendlerCycleUIString,
} from "@/uiStrings";
import WendlerBlockRowActive from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockRowActive";
import WendlerBlockRowInactive from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockRowInactive";

interface MetadataColumnProps {
  label: string;
  value: React.ReactNode;
}

const MetadataColumn: React.FC<MetadataColumnProps> = (props) => (
  <Stack alignItems="center">
    <Typography variant="caption" color="text.secondary">
      {props.label}
    </Typography>
    <Typography variant="subtitle2">{props.value}</Typography>
  </Stack>
);

export interface WendlerBlockTableProps {
  block: WendlerBlock;
  metadata: WendlerMetadata;
  availablePlates: number[];
}

// TODO - this is the next big thing to work on. Want to make this ui _really_
// easy to use for marking exercises as completed or slightly modified.

// TODO - There should be edit buttons that do dynamic ui that let stuff be
// editable, for example, the weight should use the cute render of the bar, but
// edit should make it use the barbell editor.

// TODO - make a new component to show a weight with good uistrings, etc.

const WendlerBlockTable: React.FC<WendlerBlockTableProps> = (props) => {
  const { block, metadata, availablePlates } = props;
  if (!block || block.length === 0) {
    return <Typography>No exercises found for this block.</Typography>;
  }
  let warmupCount = 0;
  let workingSetCount = 0;

  // TODO: this is another instance where the bar is just hardcoded to 45 lbs
  // instead of letting the user have a say.
  const totalVolume = block.reduce(
    (acc, row) =>
      actualWeightForTarget(
        row.actual_weight_value!,
        45,
        availablePlates,
        RoundingMode.NEAREST
      ).actualWeight *
        row.reps! +
      acc,
    0
  );

  return (
    <Stack spacing={1}>
      {/* Metadata summary */}
      <Typography variant="h4">{metadata.block_name}</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <MetadataColumn
          label="Exercise"
          value={exerciseTypeUIStringBrief(metadata.exercise_type!)}
        />
        <MetadataColumn
          label="Cycle"
          value={wendlerCycleUIString(metadata.cycle_type!)}
        />
        <MetadataColumn
          label="Training Max"
          value={`${metadata.training_max_value} ${weightUnitUIString(metadata.training_max_unit!)}`}
        />
        <MetadataColumn
          label="Increase"
          value={`${metadata.increase_amount_value} ${weightUnitUIString(metadata.increase_amount_unit!)}`}
        />
        <MetadataColumn
          label="Total Volume"
          value={`${totalVolume.toFixed(1)} ${weightUnitUIString(metadata.increase_amount_unit!)}`}
        />
      </Stack>
      {block.map((row, idx) => {
        let setName;
        if (row.warmup) {
          warmupCount++;
          setName = `Warmup ${warmupCount}`;
        } else {
          workingSetCount++;
          setName = `Working Set ${workingSetCount}`;
        }
        setName = `${setName}: ${row.actual_weight_value}x${row.reps}`;
        if (row.is_amrap) {
          setName = `${setName} (AMRAP)`;
        }
        if (row.exercise_id === metadata.active_exercise_id) {
          return (
            <WendlerBlockRowActive
              key={row.exercise_id}
              row={row}
              isLastRow={idx === block.length - 1}
              setName={setName}
              availablePlates={availablePlates}
            />
          );
        } else {
          return (
            <WendlerBlockRowInactive
              key={row.exercise_id}
              row={row}
              availablePlates={availablePlates}
              setName={setName}
              completionStatusUIString={completionStatusUIString}
            />
          );
        }
      })}
    </Stack>
  );
};

export default WendlerBlockTable;
