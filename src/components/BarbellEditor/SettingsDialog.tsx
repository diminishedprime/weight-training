"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { ALL_PLATES } from "@/constants";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  plateSizes: number[];
  onSave: (newPlateSizes: number[]) => void;
}

const SettingsDialog = (props: SettingsDialogProps) => {
  const { open, onClose, plateSizes, onSave } = props;
  const [editPlates, setEditPlates] = React.useState(plateSizes);

  React.useEffect(() => {
    setEditPlates(plateSizes);
  }, [plateSizes, open]);

  function handleAddPlate(size: number) {
    if (!editPlates.includes(size)) {
      setEditPlates([...editPlates, size].sort((a, b) => b - a));
    }
  }

  function handleRemovePlate(size: number) {
    setEditPlates(editPlates.filter((p) => p !== size));
  }

  function handleSave() {
    onSave(editPlates);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Barbell Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography>Available Plates:</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {ALL_PLATES.map((size) =>
                editPlates.includes(size) ? (
                  <Chip
                    key={size}
                    label={size}
                    onDelete={() => handleRemovePlate(size)}
                    color="primary"
                  />
                ) : (
                  <Chip
                    key={size}
                    label={size}
                    variant="outlined"
                    onClick={() => handleAddPlate(size)}
                  />
                ),
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
