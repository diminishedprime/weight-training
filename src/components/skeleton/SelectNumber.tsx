import IconButton from "@/components/skeleton/IconButton";
import { Skeleton, ToggleButtonGroup } from "@mui/material";

export default function SelectNumber() {
  return (
    <Skeleton>
      <ToggleButtonGroup size="small">
        <IconButton />
        <IconButton />
        <IconButton />
        <IconButton />
      </ToggleButtonGroup>
    </Skeleton>
  );
}
