import { Paths } from "@/constants";
import { Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Not Found
      </Typography>
      <Typography>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Link href={Paths.Home}>Go Home</Link>
    </React.Fragment>
  );
}
