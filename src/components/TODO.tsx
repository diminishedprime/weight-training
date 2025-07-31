"use client";

import { Paper, Typography, useTheme } from "@mui/material";

interface TODOProps {
  children: React.ReactNode;
}

// Change this to true if the TODOs are getting in your way.
const GLOBAL_HIDE_TODOS = false;

const TODO: React.FC<TODOProps> = (props) => {
  const theme = useTheme();
  if (GLOBAL_HIDE_TODOS) {
    return null; // Hide all TODOs globally
  }
  return (
    <Paper sx={{ p: 1, m: 1, backgroundColor: theme.palette.grey[100] }}>
      <Typography fontFamily="monospace" variant="subtitle2">
        <Typography component="span" color="error" sx={{ mr: 1 }}>
          TODO:
        </Typography>
        {props.children}
      </Typography>
    </Paper>
  );
};

export default TODO;
