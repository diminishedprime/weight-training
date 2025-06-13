"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";

export default function LoginPage() {
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
      <form action={loginAction.bind(null, redirectUri)}>
        <Button type="submit" variant="contained" color="primary" size="large">
          Sign in with Google
        </Button>
      </form>
    </Box>
  );
}
