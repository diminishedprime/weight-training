import Link from "@/components/Link";
import { PATHS } from "@/constants";
import { Typography } from "@mui/material";
import React from "react";

export default function NotFound() {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Not Found
      </Typography>
      <Typography>
        The program you are looking for does not exist or has been deleted.
      </Typography>
      <Link href={PATHS.Programs}>Go to Programs</Link>
      <Link href={PATHS.Home}>Go Home</Link>
    </React.Fragment>
  );
}
