"use client";

import NavDrawer from "@/components/banner/NavDrawer";
import { Paths } from "@/constants";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import React from "react";

const BASE_NAV_ITEMS = [
  { label: "Exercises", href: Paths.Exercise },
  { label: "Superblocks", href: Paths.Superblocks },
];

const Drawer: React.FC = () => {
  const api = useBannerClientAPI();
  return (
    <React.Fragment>
      <IconButton color="inherit" edge="start" onClick={api.handleDrawerToggle}>
        <MenuIcon />
      </IconButton>
      <NavDrawer
        open={api.drawerOpen}
        handleDrawerToggle={api.handleDrawerToggle}
        navItems={BASE_NAV_ITEMS}
      />
    </React.Fragment>
  );
};

export default Drawer;

const useBannerClientAPI = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = React.useCallback(() => {
    setDrawerOpen((prevState) => !prevState);
  }, []);

  return {
    drawerOpen,
    handleDrawerToggle,
  };
};
