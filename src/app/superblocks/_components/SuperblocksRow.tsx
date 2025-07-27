"use client";
import { type NarrowedSuperblocksRow } from "@/app/superblocks/_components/_page_Superblocks";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayTimeSince from "@/components/display/DisplayTimeSince";
import DisplayWeight from "@/components/display/DisplayWeight";
import Link from "@/components/Link";
import { pathForBlock } from "@/constants";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { Paper, Stack, Typography } from "@mui/material";
import { useFormatter } from "next-intl";

interface SuperblocksRowProps {
  superblock: NarrowedSuperblocksRow;
}

const SuperblocksRow: React.FC<SuperblocksRowProps> = (props) => {
  const format = useFormatter();
  return (
    <Stack spacing={1} component={Paper} sx={{ m: 0, p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {props.superblock.name || "No name"}
          {" Superblock"}
        </Typography>
        <DisplayWeight
          weightValue={props.superblock.training_volume}
          weightUnit={"pounds"}
        />
      </Stack>
      <Stack spacing={1} direction="row" flexWrap="wrap">
        <DisplayDate timestamp={props.superblock.started_at} row />
        <span>~</span>
        <DisplayDate timestamp={props.superblock.completed_at} row noDate />
        <Typography component="span">
          (
          <DisplayTimeSince
            date={new Date(props.superblock.completed_at)}
            addSuffix
          />
          )
        </Typography>
      </Stack>
      <Typography>
        <span>Duration: </span>
        <DisplayDuration
          from={new Date(props.superblock.started_at)}
          to={new Date(props.superblock.completed_at)}
        />
      </Typography>
      <Typography>
        <span>Blocks: </span>
        {format.list(
          props.superblock.block_details.map((block) => (
            <Link
              key={block.id}
              href={pathForBlock(block.id)}
              underline="hover"
            >
              {exerciseTypeUIStringBrief(block.exercise_type)}
            </Link>
          )),
        )}
      </Typography>
      <Stack spacing={1} direction="row" flexWrap="wrap" alignItems="baseline">
        <Typography variant="caption" flexGrow={1}>
          {props.superblock.notes}
        </Typography>
        <Typography
          component={Link}
          underline="hover"
          href={`/superblocks/${props.superblock.id}`}
          justifySelf={"flex-end"}
        >
          view details
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SuperblocksRow;
