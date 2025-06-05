import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

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
        <Box>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={user.image || undefined}
                alt={user.name || "User"}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.name}
              </Typography>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
                style={{ display: "inline" }}
              >
                <Button type="submit" variant="contained" color="error">
                  Sign out
                </Button>
              </form>
            </Box>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
              style={{ display: "inline" }}
            >
              <Button type="submit" variant="contained">
                Sign in with Google
              </Button>
            </form>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
