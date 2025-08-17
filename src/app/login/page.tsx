"use client";
import { loginAction } from "@/app/login/actions";
import Breadcrumbs from "@/components/Breadcrumbs";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUri = decodeURIComponent(
    searchParams.get("redirect-uri") || encodeURIComponent("/"),
  );
  return (
    <React.Fragment>
      <TODO>Support other login-providers.</TODO>
      <Breadcrumbs pathname={Paths.Login} />
      <Stack display="flex" alignItems="center">
        <Typography variant="body1">
          You must be logged in order to view this page.
        </Typography>
        <form action={loginAction.bind(null, redirectUri)}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Sign in with Google
          </Button>
        </form>
      </Stack>
    </React.Fragment>
  );
}
