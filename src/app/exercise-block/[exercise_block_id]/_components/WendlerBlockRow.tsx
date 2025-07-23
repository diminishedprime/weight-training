import { Stack, Typography } from "@mui/material";
import * as React from "react";

export interface WendlerBlockRowProps {
  // As in the name of the set. For example: "warmup 1" or "working set 1"
  setName: string;
  children: React.ReactNode;
  highlight?: boolean;
}

// TODO: none of these really support target & actual weight correctly, yet.
const WendlerBlockRow: React.FC<WendlerBlockRowProps> = ({
  setName,
  children,
  highlight,
}) => (
  <Stack
    sx={{
      border: 2,
      borderColor: highlight ? "primary.main" : "grey.300",
      borderRadius: 1,
      p: 1,
      boxShadow: highlight ? 2 : 0,
    }}
    direction="column"
    spacing={1}
    data-testid="wendler-block-row"
  >
    <Typography
      variant="subtitle2"
      color={highlight ? "primary" : "text.secondary"}
    >
      {setName}
    </Typography>
    {children}
  </Stack>
);

export default WendlerBlockRow;
