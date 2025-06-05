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
import { weightUnitUIString } from "@/util";
import { Database } from "@/database.types";

export default function LiftsTable({
  lifts,
  lift_type,
}: {
  lifts: Database["public"]["Functions"]["get_lifts_by_type_for_user"]["Returns"];
  lift_type: Database["public"]["Enums"]["lift_type_enum"];
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
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lifts.map((lift, idx: number) => (
            <TableRow
              key={lift.lift_id || idx}
              sx={
                flashId &&
                (lift.lift_id === flashId || lift.lift_id === flashId)
                  ? { animation: "flash-bg 1.5s ease-in-out" }
                  : {}
              }
            >
              <TableCell>
                {lift.performed_at
                  ? new Date(lift.performed_at).toLocaleString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                {lift.weight_value} {weightUnitUIString(lift.weight_unit)}
              </TableCell>
              <TableCell>{lift.reps}</TableCell>
              <TableCell>
                <Button
                  component={Link}
                  href={`/exercise/${lift_type}/edit/${
                    lift.lift_id || lift.lift_id
                  }`}
                  size="small"
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
