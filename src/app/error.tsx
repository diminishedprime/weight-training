"use client";

import { Paths } from "@/constants";
import { Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error(props: ErrorProps) {
  return (
    <Stack>
      <Typography variant="h5">Something went wrong!</Typography>
      <Typography variant="body1" color="text.secondary">
        We encountered an error.
      </Typography>
      <Stack component={Paper} p={1}>
        <Typography variant="h6">Error context:</Typography>
        <Typography component="code" variant="body2">
          {props.error.message}
        </Typography>
        <Button variant="contained" onClick={props.reset}>
          Try Again
        </Button>
      </Stack>
      <Typography>
        <Link href={Paths.Home}>Go Home</Link>
      </Typography>
    </Stack>
  );
}
