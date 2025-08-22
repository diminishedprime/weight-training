import { HydrateHomeRecentSuperblock } from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayWeight from "@/components/display/DisplayWeight";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import { Paths } from "@/constants";
import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

interface Props {
  superblocks: HydrateHomeRecentSuperblock[];
}

const RecentSuperblocks: React.FC<Props> = (props) => {
  return (
    <React.Fragment>
      <Typography variant="body1">Recent Superblocks</Typography>
      <Stack display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
        {props.superblocks.map((superblock) => (
          <Stack key={superblock.id} component={Paper} p={1} spacing={0}>
            <Typography
              component={Link}
              underline="hover"
              href={Paths.Superblocks_SuperblockId(superblock.id)}
              display="flex"
              gap={1}
              alignItems="center"
              variant="h6"
            >
              {superblock.name}
              <DisplayDate
                dateColor="textPrimary"
                timestamp={superblock.started_at}
                twoDigitYear
                row
                noTime
                variant="body2"
              />
            </Typography>
            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent="space-around"
            >
              <LabeledValue label="Volume" alignItems="center">
                <DisplayWeight
                  weightValue={superblock.total_volume}
                  weightUnit="pounds"
                />
              </LabeledValue>
              <LabeledValue label="Sets" alignItems="center">
                <Typography>{superblock.total_sets}</Typography>
              </LabeledValue>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </React.Fragment>
  );
};

export default RecentSuperblocks;
