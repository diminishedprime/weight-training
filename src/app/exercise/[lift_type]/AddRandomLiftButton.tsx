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
