"use client";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { weightUnitUIString, completionStatusUIString } from "@/uiStrings";
import CheckIcon from "@mui/icons-material/Check";
import { Database } from "@/database.types";
import { Stack, Typography } from "@mui/material";
import Barbell from "@/components/Barbell";

export default function ExercisesTable({
  exercises,
  exercise_type,
}: {
  exercises: Database["public"]["Functions"]["get_exercises_by_type_for_user"]["Returns"];
  exercise_type: Database["public"]["Enums"]["exercise_type_enum"];
}) {
  const searchParams = useSearchParams();
  const flashId = searchParams.get("flash");

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Reps</TableCell>
            <TableCell>Warmup</TableCell>
            <TableCell>Status</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {exercises.map((exercise, idx: number) => (
            <React.Fragment key={exercise.exercise_id || idx}>
              <TableRow
                sx={
                  flashId &&
                  (exercise.exercise_id === flashId ||
                    exercise.exercise_id === flashId)
                    ? { animation: "flash-bg 1.5s ease-in-out" }
                    : {}
                }
              >
                <TableCell>
                  {exercise.performed_at
                    ? new Date(exercise.performed_at).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Stack alignItems="center">
                    <span
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        width: 80,
                      }}
                    >
                      <Barbell
                        weight={exercise.weight_value ?? 0}
                        hidePlateNumbers
                      />
                    </span>
                    <Typography>
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
                  <Button
                    component={Link}
                    href={`/exercise/${exercise_type}/edit/${
                      exercise.exercise_id || exercise.exercise_id
                    }`}
                    size="small"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              {exercise.notes && exercise.notes.trim() !== "" && (
                <TableRow sx={{}}>
                  <TableCell
                    colSpan={6}
                    sx={{
                      background: "#fafafa",
                      p: 1,
                    }}
                  >
                    <Typography variant="caption">{exercise.notes}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
