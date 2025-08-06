"use client";

import { Paper, Typography, useTheme } from "@mui/material";

interface TODOProps {
  children: React.ReactNode;
  easy?: boolean;
  done?: boolean;
}

// Change this to true if the TODOs are getting in your way.
const GLOBAL_HIDE_TODOS = true;

const TODO: React.FC<TODOProps> = (props) => {
  const theme = useTheme();
  if (GLOBAL_HIDE_TODOS) {
    return null; // Hide all TODOs globally
  }
  const isEasy = !!props.easy;
  const isDone = !!props.done;

  let backgroundColor: string;
  if (isDone) {
    backgroundColor =
      theme.palette.mode === "dark"
        ? theme.palette.success.dark
        : theme.palette.success.light;
  } else if (isEasy) {
    backgroundColor =
      theme.palette.mode === "dark"
        ? theme.palette.secondary.dark
        : theme.palette.secondary.light;
  } else {
    backgroundColor = theme.palette.background.paper;
  }

  return (
    <Paper
      sx={{
        p: 1,
        m: 1,
        backgroundColor,
      }}
    >
      <Typography fontFamily="monospace" variant="subtitle2">
        <Typography
          component="span"
          color={
            isDone ? "success.main" : isEasy ? "secondary.main" : "error.main"
          }
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
