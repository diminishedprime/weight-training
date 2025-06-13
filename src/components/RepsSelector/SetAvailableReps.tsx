import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import SendIcon from "@mui/icons-material/Send";
import { Stack } from "@mui/material";
import { useSetAvailableReps } from "./useSetAvailableReps";

const COMMON_REP_CHOICES = [
  { label: "Barbell", choices: [1, 3, 5] },
  { label: "Dumbell", choices: [5, 8, 10, 12, 15] },
  { label: "Al la carte", choices: [1, 3, 5, 8, 10, 12, 15, 20] },
];

interface SetAvailableRepsProps {
  repChoices: number[];
  onClose: (choices: number[]) => void;
}

const SetAvailableReps: React.FC<SetAvailableRepsProps> = ({
  repChoices,
  onClose,
}) => {
  const api = useSetAvailableReps({ repChoices, onClose });

  return (
    <>
      <IconButton size="small" onClick={api.handleOpen} sx={{ ml: 1 }}>
        <SettingsIcon fontSize="small" />
      </IconButton>
      <Dialog open={api.open} onClose={api.handleCancel}>
        <DialogTitle>Rep Choices Settings</DialogTitle>
        <DialogContent>
          <>
            <Typography>Default Rep Choices</Typography>
            <Stack direction="row">
              {COMMON_REP_CHOICES.map(({ label, choices }) => (
                <Button
                  sx={{ mr: 1 }}
                  variant="outlined"
                  onClick={() => api.setChoices(choices)}
                  key={label}
                >
                  {label}
                </Button>
              ))}
            </Stack>
          </>
          <>
            <Typography>Rep Choices</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {api.choices.map((val) => (
                <Chip
                  key={val}
                  label={val}
                  color="primary"
                  onDelete={() => api.handleRemoveRep(val)}
                />
              ))}
            </Box>
          </>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="New Rep"
              size="small"
              value={api.pendingRepInput}
              onChange={api.handlePendingRepInputChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={api.handleAddPendingRepAsChoice}
                        disabled={api.pendingRepInput === ""}
                        edge="end"
                        aria-label="Add rep choice"
                        title="Add this rep value as a selectable button"
                        color="primary"
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={api.handleCancel}>
            Cancel
          </Button>
          <Button onClick={api.handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SetAvailableReps;
