"use client";
import React from "react";
import { Button, TextField, Typography, Alert, Stack } from "@mui/material";
import { useNewSuperblock } from "@/app/superblock/_components/NewSuperblock/useNewSuperblock";

/**
 * Props for AddNewSuperblock component.
 * None required for now, but can be extended in the future.
 */
export type AddNewSuperblockProps = Record<string, never>;

/**
 * AddNewSuperblock allows the user to create a new superblock (workout block group).
 *
 * Uses Supabase directly to insert into the exercise_superblock table.
 */
const AddNewSuperblock: React.FC<AddNewSuperblockProps> = () => {
  const api = useNewSuperblock();

  return (
    <Stack
      component="form"
      onSubmit={api.handleSubmit}
      boxShadow="2"
      spacing={2}
      sx={{ p: 1 }}
    >
      <Typography variant="h5">Create New Superblock</Typography>
      <TextField
        label="name"
        name="name"
        fullWidth
        value={api.name}
        onChange={(e) => api.setName(e.target.value)}
        size="small"
      />
      <TextField
        label="Notes"
        placeholder="(Optional)"
        name="notes"
        fullWidth
        value={api.notes}
        onChange={(e) => api.setNotes(e.target.value)}
        size="small"
        multiline
        minRows={2}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={api.loading}
      >
        {api.loading ? "Creating..." : "Create Superblock"}
      </Button>
      {api.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {api.error}
        </Alert>
      )}
    </Stack>
  );
};

export default AddNewSuperblock;
