import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/skeleton/Button";
import Typography from "@/components/skeleton/Typography";
import { Paths } from "@/constants/paths";
import { Stack } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Login} />
      <Stack display="flex" alignItems="center">
        <Typography variant="body1">
          You must be logged in order to view this page.
        </Typography>
        <Button size="large">Sign in with Google</Button>
      </Stack>
    </React.Fragment>
  );
}
