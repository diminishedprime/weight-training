"use client";

import { loginAction } from "@/app/login/_components/actions";
import { LOADING_SX } from "@/constants";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import useSWRMutation from "swr/mutation";

const SignIn: React.FC = () => {
  const api = useSignInApi();
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={api.signIn}
      sx={{ ...LOADING_SX(api.isMutating) }}
    >
      Sign in with Google
    </Button>
  );
};

export default SignIn;

const useSignInApi = () => {
  const searchParams = useSearchParams();
  const redirectUri = decodeURIComponent(
    searchParams.get("redirect-uri") || encodeURIComponent("/"),
  );

  const { trigger, isMutating } = useSWRMutation(
    "login",
    useCallback(async () => loginAction(redirectUri), [redirectUri]),
  );

  const signIn = useCallback(async () => {
    if (isMutating) {
      return;
    }
    await trigger();
  }, [trigger, isMutating]);

  return { signIn, isMutating };
};
