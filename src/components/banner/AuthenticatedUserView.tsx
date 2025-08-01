"use client";

import { signOut } from "@/components/banner/actions";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

interface AuthenticatedUserViewProps {
  user: User;
}

const useAuthenticatedUserViewAPI = (props: AuthenticatedUserViewProps) => {
  const { user } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setAnchorEl(null);
  }, []);

  // Backup initials for avatar if image is missing
  const imageBackup = useMemo(
    () =>
      user.name
        ?.split(" ")
        .map((a) => a[0])
        .join("")
        .toUpperCase() ?? "",
    [user.name],
  );

  const pathname = usePathname();
  const preferencesDisabled = useMemo(
    () => pathname === "/preferences",
    [pathname],
  );

  const preferencesHref = useMemo(() => {
    if (preferencesDisabled) {
      return "/preferences";
    }
    const searchParams = new URLSearchParams();
    searchParams.set("backTo", pathname);
    // TODO: this type of pattern is relatively common, maybe this should also
    // be supported directly in some of the path functions?
    return `/preferences?${searchParams.toString()}`;
  }, [preferencesDisabled, pathname]);

  return {
    anchorEl,
    open,
    handleClick,
    handleClose,
    handleSignOut,
    imageBackup,
    preferencesHref,
    preferencesDisabled,
  };
};

const AuthenticatedUserView: React.FC<AuthenticatedUserViewProps> = (
  props: AuthenticatedUserViewProps,
) => {
  const api = useAuthenticatedUserViewAPI(props);
  const { user } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Button
        onClick={api.handleClick}
        sx={{ borderRadius: "50%", padding: 0, minWidth: 0 }}
        aria-controls={api.open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={api.open ? "true" : undefined}
      >
        <Avatar
          src={user.image || undefined}
          alt={user.name || "User"}
          sx={{ width: 32, height: 32 }}
        >
          {user.image === null && api.imageBackup}
        </Avatar>
      </Button>
      <Menu
        id="account-menu"
        anchorEl={api.anchorEl}
        open={api.open}
        onClose={api.handleClose}
        slotProps={{
          list: { "aria-labelledby": "basic-button" },
        }}
      >
        <Box sx={{ p: 1, display: "flex" }}>
          <Avatar
            src={user.image || undefined}
            alt={user.name || "User"}
            sx={{ width: 56, height: 56, mb: 1 }}
          >
            {user.image === null && api.imageBackup}
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="body2">{user.email}</Typography>
          </Box>
        </Box>
        <MenuItem
          component={Link}
          href={api.preferencesHref}
          onClick={api.handleClose}
          sx={{ justifyContent: "right" }}
          disabled={api.preferencesDisabled}
        >
          Preferences
        </MenuItem>
        <MenuItem
          onClick={api.handleSignOut}
          sx={{ justifyContent: "right", color: "error.main" }}
        >
          Sign out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AuthenticatedUserView;
