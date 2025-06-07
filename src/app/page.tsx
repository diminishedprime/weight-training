import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Constants } from "@/database.types";
import Link from "next/link";
import { exerciseTypeUIString } from "@/uiStrings";

export default async function Home() {
  return (
    <Stack
      spacing={2}
      direction="column"
      sx={{ p: 4, alignItems: "flex-start" }}
    >
      {Constants.public.Enums.exercise_type_enum.map((type) => (
        <Button
          key={type}
          component={Link}
          href={`/exercise/${type}`}
          variant="contained"
          color="primary"
          sx={{ minWidth: 140, maxWidth: 220 }}
        >
          {exerciseTypeUIString(type)}
        </Button>
      ))}
    </Stack>
  );
}
