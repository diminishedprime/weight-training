"use client";

import { Paper, Typography, useTheme } from "@mui/material";
import { green } from "@mui/material/colors";

interface TODOProps {
  children: React.ReactNode;
  easy?: boolean;
}

// Change this to true if the TODOs are getting in your way.
const GLOBAL_HIDE_TODOS = false;

const TODO: React.FC<TODOProps> = (props) => {
  const theme = useTheme();
  if (GLOBAL_HIDE_TODOS) {
    return null; // Hide all TODOs globally
  }
  const isEasy = !!props.easy;
  return (
    <Paper
      sx={{
        p: 1,
        m: 1,
        backgroundColor: isEasy ? green[50] : theme.palette.grey[100],
      }}
    >
      <Typography fontFamily="monospace" variant="subtitle2">
        <Typography
          component="span"
          color={isEasy ? "success.main" : "error"}
          sx={{ mr: 1 }}
        >
          TODO
          {props.easy ? " (easy)" : ""}
        </Typography>
        {props.children}
      </Typography>
    </Paper>
  );
};

export default TODO;
