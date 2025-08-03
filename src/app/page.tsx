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
          <TODO done>
            Have the add program form also set the active exercise ids for each
            block and superblock, then remove the un-needed initialization logic
            via the "start block" button.
          </TODO>
          <TODO done>ability to add new blocks to an existing superblock</TODO>
          <TODO done>Support skip on the perform page</TODO>
          <TODO>
            On perform, if the rep is AMRAP, show the editor for reps regardless
            of edit status.
          </TODO>
          <TODO>
            On perform, show the perceived effort editor regardless of edit
            status.
          </TODO>
          <TODO>Support fail on the perform page</TODO>
          <TODO>
            Set up google oauth for production environment. Hopefully we can
            just use some automatic domain name things from Vercel until we're
            properly moved over from the old app.
          </TODO>
          <TODO>
            Practice a database back up and restore when there's only seed data
            so the stakes are lower.
          </TODO>
          <TODO>
            For the active exercise in the block, make it clear how much rest
            time you've had since the most recent exercise (unless it was more
            than like 20 minutes ago)
          </TODO>
          <TODO easy>
            Have steph check that their data seems right enough after publish
          </TODO>
          <TODO easy>
            Set a favicon, maybe just use the svg I made for the barbell?
          </TODO>
          <TODO easy>
            Set a website title, etc. I'm pretty sure there's a simple way to do
            that with next, just gotta figure it out.
          </TODO>
        </TODO>
        <TODO>
          Post Launch
          <TODO>
            Make it a bit more obvious that a block & superblock is "done"
          </TODO>
          <TODO>Clean up the app drawer on the left.</TODO>
          <TODO>
            Add a lil icon (maybe one of my svgs?) to the main mobile link
            thing.
          </TODO>
          <TODO>Get fancier SVGs made for the equipments, etc.</TODO>
          <TODO>
            We probably don't want to show "home" by itself in the
            breadcrumbs...
          </TODO>
          <TODO>Set up auth for an integration environment</TODO>
          <TODO>
            Add some proper theme support. This should be possible without
            flickering and stuff via mui, but IDK on the specifics.
          </TODO>
          <TODO>Switch over domain from old app to new one</TODO>
          <TODO>
            Get some backups of the old firebase app and data, then delete them
            and the old projects and stuff from GCP.
          </TODO>
          <TODO>Update links once I'm closer to done.</TODO>
          <TODO>
            The user should be able to pin programs, exercises, etc. on the home
            page.
          </TODO>
          <TODO>
            The home page should probably 'just show' the user what they want to
            do. i.e. Show them the current active program, or a button to start
            a new one, etc.
          </TODO>
          <TODO>
            Make it possible to update a target_max for a movement if it's not
            going great.
            <br />
            <br />
            With this, I'll need to think through what it means for the existing
            ones that point to the old one.
          </TODO>
          <TODO>
            See about getting the skeleton.js thing set up instead of using
            Suspense Wrappers all over.
          </TODO>
          <TODO>
            I'd like to have different color themes for local, integration, and
            production to make it easier to differentiate between all of them.
            <br />
            <br />
            We can also add in some text based on the environment to for the
            local ones. That's more of an absence thing, but I think it'll help
            a bit as well.
          </TODO>
          <TODO>
            I want to get the preview sub-domain thing working, but I think I
            need to get the preview supabase instance working, first. I think I
            just called it weight-training-integration.
          </TODO>
          <TODO>
            Add dead hangs to the body weight exercises. Use the stopwatch
            thingy with them and also figure out a way to track the duration via
            join table or something.
          </TODO>
          <TODO>
            See if I can add more flexible search into the exercise autocomplete
            thingy. In particular, it'd be nice to be able to type "abs" for
            abdomianal machine.
          </TODO>
          <TODO>
            Add a details view for the exercise selector that has a description
            of what the exercise is along with common aliases.
            <br />
            <br />
            i.e. Diverging Lat Pulldown is also sometimes just called Lat
            Pulldown.
          </TODO>
        </TODO>
      </Stack>
    </>
  );
}
