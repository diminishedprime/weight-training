import Breadcrumbs from "@/components/Breadcrumbs";
import TODO from "@/components/TODO";
import { PATHS } from "@/constants";
import { Button, Stack } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Breadcrumbs pathname="/" />
      <Stack spacing={1}>
        <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
          <Button
            component={Link}
            href={PATHS.Programs}
            variant="contained"
            color="primary"
          >
            Programs
          </Button>
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
            href={PATHS.Superblocks}
            variant="contained"
            color="primary"
          >
            Superblocks
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
        <TODO>Update links once I'm closer to done.</TODO>
        <TODO>
          The user should be able to pin programs, exercises, etc. here
        </TODO>
      </Stack>
    </>
  );
}
