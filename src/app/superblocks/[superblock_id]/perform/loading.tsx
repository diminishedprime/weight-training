import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import LabeledValue from "@/components/skeleton/LabeledValue";
import Typography from "@/components/skeleton/Typography";
import { Paths } from "@/constants/paths";
import EditIcon from "@mui/icons-material/Edit";
import {
  Accordion,
  AccordionSummary,
  Skeleton,
  Stack,
  Switch,
} from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Superblocks_SuperblockId_Perform("123")}
        nonLinkable={["123", "perform"]}
        labels={{
          [123]: <Typography component="span">Leg Day</Typography>,
        }}
      />
      <Stack direction="row" alignItems="center">
        <Skeleton>
          <DisplayCompletionStatus completionStatus={"completed"} />
        </Skeleton>
        <Typography variant="h5">Pull Day</Typography>
        <Skeleton>
          <EditIcon />
        </Skeleton>
        <Stack flex={1} />
        <LabeledValue label="Notify">
          <Skeleton>
            <Switch />
          </Skeleton>
        </LabeledValue>
      </Stack>
      <Block />
      <Block />
      <Block />
      <Block />
    </React.Fragment>
  );
}

function Block() {
  return (
    <Accordion disableGutters>
      <AccordionSummary sx={{ px: 1 }}>
        <Stack direction="row" width="100%">
          <Skeleton>
            <DisplayCompletionStatus completionStatus="completed" />
          </Skeleton>
          <Typography display="flex" alignItems={"center"} gap={1} variant="h6">
            Wendler Deadlift 3s
          </Typography>
          <Stack flex={1} />
          <Skeleton sx={{ justifySelf: "end" }}>
            <DisplayCompletionStatus completionStatus="completed" />
          </Skeleton>
        </Stack>
      </AccordionSummary>
    </Accordion>
  );
}
