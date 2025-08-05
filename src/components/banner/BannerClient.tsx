"use client";

import AuthenticatedUserView from "@/components/banner/AuthenticatedUserView";
import NavDrawer from "@/components/banner/NavDrawer";
import Link from "@/components/Link";
import { Paths } from "@/constants";
import CoffeeIcon from "@mui/icons-material/LocalCafe";
import CoffeeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { User } from "next-auth";
import NoSleep from "nosleep.js";
import * as React from "react";

interface BannerClientProps {
  user: User | undefined;
}

const BASE_NAV_ITEMS = [
  { label: "Exercises", href: Paths.Exercise },
  { label: "Superblocks", href: Paths.Superblocks },
];

const BannerClient: React.FC<BannerClientProps> = (props) => {
  const api = useBannerClientAPI(props);

  return (
    <Box>
      <AppBar component="nav" position="static" color="primary">
        <Toolbar sx={{ display: "flex", gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={api.handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            component={Link}
            href={Paths.Home}
            underline="none"
          >
            Weight Training
          </Typography>
          <Box flex={1} />
          <IconButton onClick={api.handleWakeLockToggle} color="inherit">
            {api.awake ? <CoffeeIcon /> : <CoffeeOutlinedIcon />}
          </IconButton>
          {props.user && <AuthenticatedUserView user={props.user} />}
        </Toolbar>
      </AppBar>
      <NavDrawer
        // TODO: update the nav drawer part to be a client component, the rest
        // of this can easily be a server component.
        open={api.drawerOpen}
        handleDrawerToggle={api.handleDrawerToggle}
        navItems={BASE_NAV_ITEMS}
      />
    </Box>
  );
};

export default BannerClient;

const useBannerClientAPI = (_: BannerClientProps) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [awake, setAwake] = React.useState(false);
  const noSleepRef = React.useRef<NoSleep | null>(null);

  const handleWakeLockToggle = React.useCallback(() => {
    if (!noSleepRef.current) {
      noSleepRef.current = new NoSleep();
    }
    if (!awake) {
      noSleepRef.current.enable();
      setAwake(true);
    } else {
      noSleepRef.current.disable();
      setAwake(false);
    }
  }, [awake]);

  const handleDrawerToggle = React.useCallback(() => {
    setDrawerOpen((prevState) => !prevState);
  }, []);

  return {
    drawerOpen,
    awake,
    handleDrawerToggle,
    handleWakeLockToggle,
  };
};
