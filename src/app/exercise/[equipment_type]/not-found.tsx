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
        The equipment type you are looking for does not exist or has been
        deleted.
      </Typography>
      <Link href={PATHS.Exercise}>Go to Exercises</Link>
    </React.Fragment>
  );
}
