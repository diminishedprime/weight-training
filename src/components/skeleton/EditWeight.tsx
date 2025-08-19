import IconButton from "@/components/skeleton/IconButton";
import { Skeleton, Stack } from "@mui/material";

export default function EditWeight() {
  return (
    <Stack alignItems="center">
      <Stack
        spacing={0.5}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <IconButton />
        <IconButton />
        <Skeleton variant="rectangular" width="11ch" height="36px" />
        <IconButton />
        <IconButton />
      </Stack>
    </Stack>
  );
}
