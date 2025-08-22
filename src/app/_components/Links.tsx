import Link from "@/components/Link";
import QuickPushupButton from "@/components/mutate/QuickPushupButton";
import { Paths } from "@/constants";
import { Button, Stack } from "@mui/material";

interface Props {
  userId: string;
}

const Links: React.FC<Props> = (props) => {
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="center"
      sx={{ "& > *": { flex: "1 0 auto" } }}
    >
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
        href={Paths.PersonalRecords}
        variant="contained"
        color="primary"
      >
        Personal Records
      </Button>
      <QuickPushupButton userId={props.userId} />
    </Stack>
  );
};

export default Links;
