import { RDispatch } from "@/common-types";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface NotificationsProps {
  serverPushoverAPIToken: string | null;
  setPushoverAPIToken: RDispatch<string | null>;
  serverPushoverUserKey: string | null;
  setPushoverUserKey: RDispatch<string | null>;
  setModified: RDispatch<boolean>;
}

const Notifications: React.FC<NotificationsProps> = (props) => {
  const api = useNotificationsAPI(props);
  return (
    <LabeledValue
      label="Notifications"
      labelVariant="h6"
      help={
        <Stack>
          <Typography variant="body2">
            Okay, so the notifications system is extremely basic and requires
            quite a bit of manual (one-time) setup.
          </Typography>
          <Typography variant="body2">
            First, you will need to{" "}
            <a
              href="https://pushover.net/signup"
              target="_blank"
              rel="noopener noreferrer"
            >
              create a Pushover account
            </a>
          </Typography>
          <Typography variant="body2">
            Then you will need to{" "}
            <a
              href="https://pushover.net/apps/build"
              target="_blank"
              rel="noopener noreferrer"
            >
              create a new application
            </a>{" "}
            with a name of "Weight Training". After creation, copy the API token
            to the Application API Token field here.
          </Typography>
          <Typography variant="body2">
            Finally, on the{" "}
            <a
              href="https://pushover.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pushover website
            </a>
            , you will need to copy your User Key
          </Typography>
        </Stack>
      }
    >
      <Stack sx={{ mt: 1 }}>
        <Stack flexWrap="wrap">
          <TextField
            size="small"
            label="Application API Token"
            variant="outlined"
            value={api.pushoverAPIKey}
            onChange={(e) => api.setPushoverAPIKey(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="User Key"
            variant="outlined"
            value={api.userKey}
            onChange={(e) => api.setUserKey(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          THESE VALUES ARE CURRENTLY STORED IN PLAINTEXT ON THE SERVER, DO NOT
          CONSIDER THIS SECURE.
          <TODO>
            I really ought to figure out how to do encryption with postgres...
          </TODO>
        </Typography>
        <Button
          variant="outlined"
          onClick={api.sendTestNotification}
          disabled={api.testDisabled}
          sx={{ alignSelf: "flex-end" }}
        >
          Test
        </Button>
      </Stack>
    </LabeledValue>
  );
};

export default Notifications;

const useNotificationsAPI = (props: NotificationsProps) => {
  const {
    serverPushoverAPIToken: serverPushoverAPIKey,
    serverPushoverUserKey: serverUserKey,
    setModified,
    setPushoverAPIToken: parentSetKey,
    setPushoverUserKey: parentSetUserKey,
  } = props;

  const [pushoverAPIKey, setPushoverAPIKey] = useState(
    props.serverPushoverAPIToken ?? "",
  );

  const [userKey, setUserKey] = useState(props.serverPushoverUserKey ?? "");

  const sendTestNotification = useCallback(async () => {
    if (!pushoverAPIKey || !userKey) return;

    const formData = new FormData();
    formData.append("token", pushoverAPIKey);
    formData.append("user", userKey);
    formData.append(
      "message",
      "Rest time is over! (and notifications are working)",
    );

    await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      body: formData,
    });
  }, [pushoverAPIKey, userKey]);

  const testDisabled = useMemo(
    () => !pushoverAPIKey || !userKey,
    [pushoverAPIKey, userKey],
  );

  const modified = useMemo(
    () => serverPushoverAPIKey !== pushoverAPIKey || serverUserKey !== userKey,
    [serverPushoverAPIKey, serverUserKey, pushoverAPIKey, userKey],
  );

  useEffect(() => {
    setModified((_) => modified);
  }, [modified, setModified]);

  useEffect(() => {
    parentSetKey((_) => pushoverAPIKey);
    parentSetUserKey((_) => userKey);
  }, [pushoverAPIKey, parentSetKey, userKey, parentSetUserKey]);

  return {
    pushoverAPIKey,
    setPushoverAPIKey,
    userKey,
    setUserKey,
    sendTestNotification,
    testDisabled,
  };
};
