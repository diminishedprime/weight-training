import Breadcrumbs, { BreadcrumbsProps } from "@/components/Breadcrumbs";
import { BARBELL_EXERCISES } from "@/util";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import { pathForBarbellExercisePage, pathForBarbellPage } from "@/constants";

const BARBELL_EXERCISES_DATA = BARBELL_EXERCISES.map((exercise) => ({
  href: pathForBarbellExercisePage(exercise),
  linkText: exerciseTypeUIStringBrief(exercise),
}));

export default function BarbellExercisePage() {
  const breadcrumbsProps: BreadcrumbsProps = {
    pathname: pathForBarbellPage,
  };
  return (
    <React.Fragment>
      <Breadcrumbs {...breadcrumbsProps} />
      <Stack spacing={1}>
        {BARBELL_EXERCISES_DATA.map(({ href, linkText }) => (
          <Typography key={linkText} component={Link} href={href}>
            {linkText}
          </Typography>
        ))}
      </Stack>
      <Typography>
        TODO: put in the links to the barbell exercises here.
      </Typography>
    </React.Fragment>
  );
}
