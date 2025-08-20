import { RDispatch } from "@/common-types";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar, SnackbarCloseReason } from "@mui/material";
import React, { useCallback, useEffect } from "react";

export interface Notification {
  message: string;
  key: Date;
}

interface Props {
  notifications: Notification[];
  setNotifications: RDispatch<Notification[]>;
}

const Notify: React.FC<Props> = (props) => {
  const api = useNotifyAPI(props);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      key={api.messageInfo ? api.messageInfo.key.getTime() : undefined}
      open={api.open}
      autoHideDuration={3000}
      onClose={api.handleClose}
      slotProps={{ transition: { onExited: api.handleExited } }}
      message={api.messageInfo ? api.messageInfo.message : undefined}
      action={
        <React.Fragment>
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={api.handleClose}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  );
};

export default Notify;

const useNotifyAPI = (props: Props) => {
  const { notifications, setNotifications } = props;
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<
    Notification | undefined
  >(undefined);

  useEffect(() => {
    if (notifications.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...notifications[0] });
      setNotifications((prev) => prev.slice(1));
      setOpen(true);
    } else if (notifications.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [notifications, messageInfo, open, setNotifications]);

  const handleClose = useCallback(
    (_: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    },
    [],
  );

  const handleExited = useCallback(() => {
    setMessageInfo(undefined);
  }, []);

  return {
    open,
    messageInfo,
    handleClose,
    handleExited,
  };
};
