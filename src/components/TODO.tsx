"use client";

import { Paper, Typography, useTheme } from "@mui/material";
import { green, purple } from "@mui/material/colors";

interface TODOProps {
  children: React.ReactNode;
  easy?: boolean;
  done?: boolean;
}

// Change this to true if the TODOs are getting in your way.
const GLOBAL_HIDE_TODOS = false;

const TODO: React.FC<TODOProps> = (props) => {
  const theme = useTheme();
  if (GLOBAL_HIDE_TODOS) {
    return null; // Hide all TODOs globally
  }
  const isEasy = !!props.easy;
  const isDone = !!props.done;
  return (
    <Paper
      sx={{
        p: 1,
        m: 1,
        backgroundColor: isDone
          ? green[50]
          : isEasy
            ? purple[50]
            : theme.palette.grey[100],
      }}
    >
      <Typography fontFamily="monospace" variant="subtitle2">
        <Typography
          component="span"
          color={isDone ? "success.main" : isEasy ? "secondary.main" : "error"}
          sx={{ mr: 1 }}
        >
          {isDone ? "Done!" : "TODO"}
          {props.easy ? " (easy)" : ""}
        </Typography>
        {props.children}
      </Typography>
    </Paper>
  );
};

export default TODO;
