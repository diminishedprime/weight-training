"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AuthenticatedUserView from "@/components/banner/AuthenticatedUserView";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { User } from "next-auth";
import NavDrawer from "@/components/banner/NavDrawer";
import Link from "next/link";

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
        <Toolbar sx={{ display: "flex" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ textDecoration: "none", color: "inherit" }}>
            Weight Training
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AuthenticatedUserView user={user} />
            </Box>
          )}
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
