import Link from "next/link";
import { Button, Stack } from "@mui/material";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Home() {
  return (
    <>
      <Breadcrumbs pathname="/" />
      <Stack spacing={2} direction="row">
        <Button
          component={Link}
          href="/exercise"
          variant="contained"
          color="primary">
          Exercises
        </Button>
        <Button
          component={Link}
          href="/superblock"
          variant="contained"
          color="primary">
          Superblock
        </Button>
        <Button
          component={Link}
          href="/preferences"
          variant="contained"
          color="primary">
          Preferences
        </Button>
      </Stack>
    </>
  );
}
