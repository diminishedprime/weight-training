import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { auth } from "@/auth";
import AuthenticatedUserView from "./AuthenticatedUserView";

export default async function Banner() {
  const session = await auth();
  const user = session?.user;

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ color: "inherit", textDecoration: "none", fontWeight: "bold" }}
        >
          Weight Training
        </Typography>
        <Box>{user && <AuthenticatedUserView user={user} />}</Box>
      </Toolbar>
    </AppBar>
  );
}
