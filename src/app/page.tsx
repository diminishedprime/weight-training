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
        <TODO>
          Minimum requirements for Launch
          <TODO done>
            ability to create a new wendler program based off the old one
          </TODO>
          <TODO done>
            ability to complete exercises in an exercise block from a view
          </TODO>
          <TODO>
            Have the add program form also set the active exercise ids for each
            block and superblock, then remove the un-needed initialization logic
            via the "start block" button.
          </TODO>
          <TODO>ability to add new blocks to an existing superblock</TODO>
          <TODO>
            For the active exercise in the block, make it clear how much rest
            time you've had since the most recent exercise (unless it was more
            than like 20 minutes ago)
          </TODO>
          <TODO easy>
            Have steph check that their data seems right enough after publish
          </TODO>
        </TODO>
        <TODO>
          Post Launch
          <TODO>Update links once I'm closer to done.</TODO>
          <TODO>
            The user should be able to pin programs, exercises, etc. here
          </TODO>
          <TODO>
            Make it possible to update a target_max if it's not going great.
            <br />
            <br />
            With this, I'll need to think through what it means for the existing
            ones that point to the old one.
          </TODO>
        </TODO>
      </Stack>
    </>
  );
}
