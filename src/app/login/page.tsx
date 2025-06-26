"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/app/login/actions";
import { Typography } from "@mui/material";
import { Suspense } from "react";

const LoginContent = () => {
  const searchParams = useSearchParams();
  const redirectUri = decodeURIComponent(
    searchParams.get("redirect-uri") || encodeURIComponent("/"),
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      gap={3}
    >
      <Typography variant="body1">
        You must be logged in order to view this page.
      </Typography>
      <form action={loginAction.bind(null, redirectUri)}>
        <Button type="submit" variant="contained" color="primary" size="large">
          Sign in with Google
        </Button>
      </form>
    </Box>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
