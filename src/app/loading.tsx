import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/skeleton/Button";
import { Paths } from "@/constants";
import { Stack } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Home} />
      <Stack direction="row" flexWrap="wrap" alignItems="center">
        <Button variant="contained" color="primary">
          Programs
        </Button>
        <Button variant="contained" color="primary">
          Exercises
        </Button>
        <Button variant="contained" color="primary">
          Superblocks
        </Button>
        <Button variant="contained" color="primary">
          Preferences
        </Button>
        <Button variant="contained" color="primary">
          Personal Records
        </Button>
        <Button variant="contained" color="secondary">
          Quick Pushups (5x5)
        </Button>
      </Stack>
    </React.Fragment>
  );
}
