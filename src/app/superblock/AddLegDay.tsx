"use client";
import { useState } from "react";
import { addLegDaySuperblock } from "./actions";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { Database } from "@/database.types";

export default function AddLegDay() {
  const [trainingMax, setTrainingMax] = useState<number | undefined>();
  const [cycle, setCycle] =
    useState<Database["public"]["Enums"]["wendler_cycle_type_enum"]>("5");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    if (trainingMax === undefined || trainingMax <= 0) {
      setError("Please enter a valid training max.");
      return;
    }
    try {
      await addLegDaySuperblock(trainingMax, cycle, new FormData());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        m: 1,
        p: 2,
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Create Leg Day Superblock
      </Typography>
      <Box mb={2}>
        <Typography variant="subtitle1" mb={1}>
          Wendler Cycle
        </Typography>
        <Select
          name="cycle"
          fullWidth
          value={cycle}
          onChange={(e) =>
            setCycle(
              e.target
                .value as Database["public"]["Enums"]["wendler_cycle_type_enum"],
            )
          }
          size="small"
        >
          <MenuItem value="5">5</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="deload">deload</MenuItem>
        </Select>
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1" mb={1}>
          Target Max (lbs)
        </Typography>
        <TextField
          name="trainingMax"
          fullWidth
          value={trainingMax}
          onChange={(e) => setTrainingMax(Number(e.target.value))}
          required
          size="small"
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Superblock"}
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Superblock created!
        </Alert>
      )}
    </Box>
  );
}
