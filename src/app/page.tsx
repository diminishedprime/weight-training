import Breadcrumbs from "@/components/Breadcrumbs";
import QuickPushupButton from "@/components/mutate/QuickPushupButton";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { requireLoggedInUser } from "@/serverUtil";
import { Button, Stack } from "@mui/material";
import Link from "next/link";

export default async function Home() {
  const { userId } = await requireLoggedInUser(Paths.Home);
  return (
    <>
      <Breadcrumbs pathname={Paths.Home} />
      <Stack direction="row" flexWrap="wrap" alignItems="center">
        <Button
          component={Link}
          href={Paths.Programs}
          variant="contained"
          color="primary"
        >
          Programs
        </Button>
        <Button
          component={Link}
          // TODO: easy, rename exercise path to be exercises
          href={Paths.Exercise}
          variant="contained"
          color="primary"
        >
          Exercises
        </Button>
        <Button
          component={Link}
          href={Paths.Superblocks}
          variant="contained"
          color="primary"
        >
          Superblocks
        </Button>
        <Button
          component={Link}
          href={Paths.Preferences}
          variant="contained"
          color="primary"
        >
          Preferences
        </Button>
        <Button
          component={Link}
          href={Paths.PersonalRecords}
          variant="contained"
          color="primary"
        >
          Personal Records
        </Button>
        <QuickPushupButton userId={userId} />
      </Stack>
      <Stack>
        <TODO>
          Misc Todos
          <TODO>
            Practice a database back up and restore when there's only seed data
            so the stakes are lower.
          </TODO>
          <TODO easy>Clean up the app drawer on the left.</TODO>
          <TODO>Get fancier SVGs made for the equipments, etc.</TODO>
          <TODO easy>
            We probably don't want to show "home" by itself in the
            breadcrumbs...
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
            <br />
            <br />
            This is particularly relevant after I failed my first squat 5s this
            last week. Should probably figure this out before 3s.
          </TODO>
          <TODO>
            I'd like to have different color themes for local, integration, and
            production to make it easier to differentiate between all of them.
            <br />
            <br />
            We can also add in some text based on the environment to for the
            local ones. That's more of an absence thing, but I think it'll help
            a bit as well.
            <br />
            <br />I just realized I can just do this by changing my preferences
            in the other environments to account for this.
          </TODO>
          <TODO>
            Add dead hangs to the body weight exercises. Use the stopwatch
            thingy with them and also figure out a way to track the duration via
            join table or something.
          </TODO>
          <TODO>
            Add a details view for the exercise selector that has a description
            of what the exercise is along with common aliases.
            <br />
            <br />
            i.e. Diverging Lat Pulldown is also sometimes just called Lat
            Pulldown.
          </TODO>
          <TODO>
            Add in a the current version of the app to the footer or something,
            so it's easy to see which thing is deployed.
            <TODO>
              Add in a changelog to the footer on the version as a link after
            </TODO>
          </TODO>
          <TODO>
            Add in some triggers for superblocks & blocks to update themselves
            for things like started at, and status automatically. Right now you
            have to really carefully update everything manually, but it'd be
            nice for that logic to just be handled by a trigger.
          </TODO>
          <TODO>
            Update the add block functionality to use median instead of average
            since that's probably what people usually want.
          </TODO>
        </TODO>
      </Stack>
    </>
  );
}
