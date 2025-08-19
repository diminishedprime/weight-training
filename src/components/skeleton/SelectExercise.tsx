import Chip from "@/components/skeleton/Chip";
import IconButton from "@/components/skeleton/IconButton";
import { Skeleton, Stack } from "@mui/material";

export default function SelectExercise() {
  return (
    <Stack spacing={0.5}>
      <Stack direction="row" flexWrap="wrap">
        <Chip label="Push" />
        <Chip label="Pull" />
        <Chip label="Legs" />
        <Chip label="Shoulders" />
        <Chip label="All" />
        <Chip label="None" />
      </Stack>
      <Stack direction="row" alignItems="center">
        <Stack flex={1}>
          <Skeleton width="100%" height="48px" />
        </Stack>
        <IconButton />
      </Stack>
    </Stack>
  );
}
