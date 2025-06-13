"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { User } from "next-auth";
import { handleSignOut } from "./actions";
import { useState } from "react";

interface AuthenticatedUserViewProps {
  user: User;
}

export default function AuthenticatedUserView({ user }: AuthenticatedUserViewProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Button
        onClick={handleClick}
        sx={{ borderRadius: '50%', padding: 0, minWidth: 0 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          src={user.image || undefined}
          alt={user.name || "User"}
          sx={{ width: 32, height: 32 }}
        >
          {user.image === null && user.name?.split(' ').map(a => a[0]).join('').toUpperCase()}
        </Avatar>
      </Button>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: { "aria-labelledby": "basic-button" },
        }}
      >
        <Box sx={{ p: 1, display: 'flex'}}>
          <Avatar
            src={user.image || undefined}
            alt={user.name || "User"}
            sx={{ width: 56, height: 56, mb: 1 }}
          >
            {user.image === null && user.name?.split(' ').map(a => a[0]).join('').toUpperCase()}
          </Avatar>
          <Box sx={{display: 'flex', flexDirection: 'column', ml: 1}}>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="body2">{user.email}</Typography>
          </Box>
        </Box>
        <MenuItem
          onClick={async () => {
            await handleSignOut();
            handleClose();
          }}
          sx={{ justifyContent: 'right', color: 'error.main' }}
        >
          Sign out
        </MenuItem>
      </Menu>
    </Box>
  );
}
