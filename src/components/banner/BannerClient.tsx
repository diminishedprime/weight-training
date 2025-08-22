import AuthenticatedUserView from "@/components/banner/AuthenticatedUserView";
import Drawer from "@/components/banner/Drawer";
import WakeLock from "@/components/banner/WakeLock";
import Link from "@/components/Link";
import { Paths } from "@/constants";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { User } from "next-auth";
import * as React from "react";

interface BannerClientProps {
  user: User | undefined;
}

const BannerClient: React.FC<BannerClientProps> = (props) => {
  return (
    <Box>
      <AppBar component="nav" position="static" color="primary">
        <Toolbar sx={{ display: "flex", gap: 1 }}>
          <Drawer />
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
          <WakeLock />
          <AuthenticatedUserView user={props.user} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default BannerClient;
