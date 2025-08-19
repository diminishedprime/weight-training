import Icon from "@/components/skeleton/Icon";
import { IconButton as MUIIconButton, Skeleton } from "@mui/material";

export default function IconButton() {
  return (
    <Skeleton>
      <MUIIconButton>
        <Icon />
      </MUIIconButton>
    </Skeleton>
  );
}
