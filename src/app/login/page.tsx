import SignIn from "@/app/login/_components/SignIn";
import Breadcrumbs from "@/components/Breadcrumbs";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { Stack, Typography } from "@mui/material";
import React from "react";

export default function LoginPage() {
  return (
    <React.Fragment>
      <TODO>Support other login-providers.</TODO>
      <Breadcrumbs pathname={Paths.Login} />
      <Stack display="flex" alignItems="center">
        <Typography variant="body1">
          You must be logged in order to view this page.
        </Typography>
        <SignIn />
      </Stack>
    </React.Fragment>
  );
}
