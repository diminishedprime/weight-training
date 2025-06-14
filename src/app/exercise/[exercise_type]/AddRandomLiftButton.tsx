// istanbul ignore file
// This file is excluded from coverage and tests as it's only used during active development and will be removed later.

"use client";
import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export default function AddRandomLiftButton({
  addRandomLift,
}: {
  addRandomLift: (formData: FormData) => void;
}) {
  return (
    <form action={addRandomLift}>
      <Button type="submit" variant="contained" startIcon={<AddIcon />}>
        Add Random Lift
      </Button>
    </form>
  );
}
