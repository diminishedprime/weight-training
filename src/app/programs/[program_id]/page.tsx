import PageProgramById from "@/app/programs/[program_id]/_components/_page_ProgramById";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PATHS } from "@/constants";
import { parseSearchParams, SEARCH_PARSERS } from "@/serverUtil";
import React, { Suspense } from "react";

interface ProgramByIdSuspenseWrapperProps {
  params: Promise<{ program_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProgramByIdSuspenseWrapper(
  props: ProgramByIdSuspenseWrapperProps,
) {
  const [{ program_id: programId }, { editable }] = await Promise.all([
    props.params,
    parseSearchParams(props.searchParams, SEARCH_PARSERS.EDITABLE),
  ]);

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={PATHS.ProgramById(programId)}
        truncate={[programId]}
        nonLinkable={[programId]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PageProgramById editable={editable} programId={programId} />
      </Suspense>
    </React.Fragment>
  );
}
