"use client";

import { Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="h5">Something went wrong!</Typography>
      <Typography variant="body1" color="text.secondary">
        We encountered an error.
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Error context:</Typography>
        <Typography component="code" variant="body2">
          {error.message}
        </Typography>
      </Paper>
      <Typography>
        <Link href="/">Go Home</Link>
      </Typography>
    </Stack>
  );
};

export default Error;
