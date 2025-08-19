"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import DisplayDate from "@/components/skeleton/DisplayDate";
import HorizontalStepper from "@/components/skeleton/HorizontalStepper";
import Typography from "@/components/skeleton/Typography";
import { Paths } from "@/constants/paths";
import { Skeleton, Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";

export default function Loading() {
  const path = usePathname();
  const parts = path.split("/");
  const [_root, _programs, programId] = parts;
  // TODO: for some reason, the breadcrumbs or something has layout shift here
  // which is kinda annoying. Can't be arsed to figure it out right now, though.
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Programs_ProgramId(programId)}
        truncate={[programId]}
        nonLinkable={[programId]}
      />
      <Typography variant="h5">Wendler Program 4</Typography>
      <Stack direction="row" alignItems={"center"}>
        <DisplayDate />
        <Typography>-</Typography>
        <DisplayDate />
      </Stack>
      <Skeleton sx={{ width: "100%" }} />
      <Typography variant="body2" color="textSecondary">
        Here are some program notes.
      </Typography>
      <HorizontalStepper stepNames={["5s", "3s", "1s", "Deload"]} />
      <Stack spacing={0}>
        <Skeleton sx={{ width: "100%" }} height={48} />
        <Skeleton sx={{ width: "100%" }} height={48} />
        <Skeleton sx={{ width: "100%" }} height={48} />
        <Skeleton sx={{ width: "100%" }} height={48} />
      </Stack>
    </React.Fragment>
  );
}
