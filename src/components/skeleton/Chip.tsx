import { ChipProps, Chip as MUIChip, Skeleton } from "@mui/material";

export default function Chip(props: Pick<ChipProps, "label">) {
  return (
    <Skeleton>
      <MUIChip label={props.label} />
    </Skeleton>
  );
}
