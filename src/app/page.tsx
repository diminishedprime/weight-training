import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Constants } from "@/database.types";
import Link from "next/link";
import { liftTypeUIString } from "@/util";

export default async function Home() {
  const liftTypes = Constants.public.Enums.lift_type_enum;

  return (
    <Stack
      spacing={2}
      direction="column"
      sx={{ p: 4, alignItems: "flex-start" }}
    >
      {liftTypes.map((type) => (
        <Button
          key={type}
          component={Link}
          href={`/exercise/${type}`}
          variant="contained"
          color="primary"
          sx={{ minWidth: 140, maxWidth: 220 }}
        >
          {liftTypeUIString(type)}
        </Button>
      ))}
    </Stack>
  );
}
