"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import AuthenticatedUserView from "./AuthenticatedUserView";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import { User } from "next-auth";
import NavDrawer from "./NavDrawer";

interface Props {
  user: User | undefined;
}

const BASE_NAV_ITEMS = [
  { label: "Exercises", href: "/exercise" },
  { label: "Superblocks", href: "/superblock" },
];

export default function BannerClient(props: Props) {
  const { user } = props;
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
            <Typography variant="h6" component="span" sx={{ ml: 1 }}>
              Weight Training
            </Typography>
          </IconButton>
          {user && <AuthenticatedUserView user={user} />}
        </Toolbar>
      </AppBar>
      <NavDrawer
        open={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        navItems={BASE_NAV_ITEMS}
      />
    </Box>
  );
}
