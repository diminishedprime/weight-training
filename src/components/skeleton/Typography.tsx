import {
  Typography as MUITypography,
  Skeleton,
  TypographyProps,
} from "@mui/material";

export default function Typography(props: TypographyProps) {
  const sx = props.sx || {};
  return (
    <Skeleton sx={{ ...sx, px: 1 }}>
      <MUITypography {...props}>{props.children}</MUITypography>
    </Skeleton>
  );
}
