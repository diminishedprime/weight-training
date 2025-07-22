import { useRequiredModifiableLabel } from "@/hooks";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, TextField } from "@mui/material";
import React from "react";

interface EditNotesProps {
  notes: string | undefined;
  onNotesChange: (notes: string | undefined) => void;
  isRequired?: boolean;
  isModified?: boolean;
}

const useEditNotesAPI = (props: EditNotesProps) => {
  const { onNotesChange, notes, isRequired, isModified } = props;

  const onClearNotes = React.useCallback(() => {
    onNotesChange("");
  }, [onNotesChange]);

  const label = useRequiredModifiableLabel("Notes", !!isRequired, !!isModified);

  return { notes, onClearNotes, onNotesChange, label };
};

const EditNotes: React.FC<EditNotesProps> = (props) => {
  const api = useEditNotesAPI(props);
  return (
    <TextField
      multiline
      fullWidth
      minRows={2}
      label={api.label}
      value={api.notes}
      onChange={(e) => api.onNotesChange(e.target.value)}
      required={props.isRequired}
      slotProps={{
        input: {
          endAdornment: (
            <IconButton
              aria-label="clear notes"
              onClick={api.onClearNotes}
              color={api.notes ? "primary" : "default"}
              size="small"
              disabled={!api.notes}
              // TODO: this my: -1 thing is a bit of a hack, I should see if
              // there's a better way to position this well.
              sx={{ alignSelf: "flex-start", my: -1 }}
            >
              <ClearIcon />
            </IconButton>
          ),
        },
      }}
    />
  );
};

export default EditNotes;
