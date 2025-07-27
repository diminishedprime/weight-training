import Breadcrumbs from "@/components/Breadcrumbs";
import { PATHS } from "@/constants";
import { Button, Stack } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Breadcrumbs pathname="/" />
      <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
        <Button
          component={Link}
          href="/exercise"
          variant="contained"
          color="primary"
        >
          Exercises
        </Button>
        <Button
          component={Link}
          href="/exercise-block"
          variant="contained"
          color="primary"
        >
          Exercise Blocks
        </Button>
        <Button
          component={Link}
          href={PATHS.Superblocks}
          variant="contained"
          color="primary"
        >
          Superblocks
        </Button>
        <Button
          component={Link}
          href="/exercise-block/wendler/leg-day"
          variant="contained"
          color="primary"
        >
          Wendler Leg Day Block
        </Button>
        <Button
          component={Link}
          href="/preferences"
          variant="contained"
          color="primary"
        >
          Preferences
        </Button>
        <Button
          component={Link}
          href="/personal-records"
          variant="contained"
          color="primary"
        >
          Personal Records
        </Button>
      </Stack>
    </>
  );
}
