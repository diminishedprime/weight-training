import { Stack, Typography } from "@mui/material";

interface DisplayNotesProps {
  notes: string | null;
}

const DisplayNotes: React.FC<DisplayNotesProps> = (props) => {
  if (props.notes === null || props.notes.trim() === "") {
    return null;
  }
  const lines = props.notes.split("\n");
  return (
    <Stack spacing={1}>
      {lines.map((line, idx) => (
        <Typography key={idx} variant="caption" color="text.secondary">
          {line}
        </Typography>
      ))}
    </Stack>
  );
};

export default DisplayNotes;
