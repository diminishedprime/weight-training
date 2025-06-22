import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { Database } from "@/database.types";
import { weightUnitUIString, completionStatusUIString } from "@/uiStrings";
import TimeDisplay from "@/components/TimeDisplay";

interface ExerciseBlockProps {
  block: {
    block_id: string;
    block_order: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    exercises: Database["public"]["Functions"]["get_exercise_blocks_for_superblock"]["Returns"];
  };
}

const ExerciseBlock: React.FC<ExerciseBlockProps> = ({ block }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Reps</TableCell>
            <TableCell>Warmup</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Effort</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {block.exercises.map((exercise, idx) => (
            <TableRow key={exercise.exercise_id || idx}>
              <TableCell>
                {exercise.performed_at && (
                  <TimeDisplay performedAt={exercise.performed_at} />
                )}
              </TableCell>
              <TableCell align="center">
                <Stack alignItems="center">
                  <Typography sx={{ mt: 1 }}>
                    {exercise.weight_value}{" "}
                    {weightUnitUIString(exercise.weight_unit)}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>{exercise.reps}</TableCell>
              <TableCell align="center">
                {exercise.warmup ? (
                  <CheckIcon fontSize="small" titleAccess="Warmup Set" />
                ) : null}
              </TableCell>
              <TableCell>
                {completionStatusUIString(exercise.completion_status)}
              </TableCell>
              <TableCell>
                {exercise.relative_effort === "hard" ? (
                  <SentimentVeryDissatisfiedIcon
                    titleAccess="Hard"
                    color="error"
                  />
                ) : exercise.relative_effort === "okay" ? (
                  <SentimentSatisfiedAltIcon
                    titleAccess="Okay"
                    color="primary"
                  />
                ) : exercise.relative_effort === "easy" ? (
                  <SentimentVerySatisfiedIcon
                    titleAccess="Easy"
                    color="success"
                  />
                ) : null}
              </TableCell>
              <TableCell>
                {exercise.notes_exercise &&
                exercise.notes_exercise.trim() !== "" ? (
                  <Typography variant="caption">
                    {exercise.notes_exercise}
                  </Typography>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExerciseBlock;
