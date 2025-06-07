import Link from "next/link";
import { Typography, Stack, Button } from "@mui/material";

export default function Home() {
  return (
    <Button
      component={Link}
      href="/exercise"
      variant="contained"
      color="primary"
      sx={{ m: 1 }}
    >
      Exercises
    </Button>
  );
}
