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
          href="/exercise-block/wendler/leg-day"
          variant="contained"
          color="primary">
          Wendler Leg Day Block
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
