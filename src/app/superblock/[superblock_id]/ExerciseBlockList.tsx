"use client";
import React from "react";
import ExerciseBlock from "@/app/superblock/[superblock_id]/ExerciseBlock";
import { Box, Typography } from "@mui/material";
import type { Database } from "@/database.types";

type BlockRow =
  Database["public"]["Functions"]["get_exercise_blocks_for_superblock"]["Returns"][number];
export type GroupedBlock = Omit<
  BlockRow,
  | "exercise_id"
  | "exercise_order"
  | "performed_at"
  | "weight_value"
  | "weight_unit"
  | "reps"
  | "warmup"
  | "completion_status"
  | "relative_effort"
  | "notes_exercise"
  | "exercise_type"
  | "equipment_type"
> & {
  exercises: BlockRow[];
};

interface ExerciseBlockListProps {
  blocks: GroupedBlock[];
}

const ExerciseBlockList: React.FC<ExerciseBlockListProps> = ({ blocks }) => {
  return (
    <>
      {blocks.map((block) => (
        <Box key={block.block_id} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {block.name ? block.name : `Block #${block.block_order}`}
          </Typography>
          {block.notes && (
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              {block.notes}
            </Typography>
          )}
          <ExerciseBlock block={block} />
        </Box>
      ))}
    </>
  );
};

export default ExerciseBlockList;
