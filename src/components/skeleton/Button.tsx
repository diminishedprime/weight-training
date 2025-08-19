import { ButtonProps, Button as MUIButton, Skeleton } from "@mui/material";

export default function Button(props: ButtonProps) {
  const sx = props.sx || {};
  return (
    <Skeleton sx={{ ...sx, px: 1 }}>
      <MUIButton>{props.children}</MUIButton>
    </Skeleton>
  );
}
