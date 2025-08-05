import PageExerciseSuperblock from "@/app/superblocks/_components/_page_Superblocks";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import { parseSearchParams, SEARCH_PARSERS } from "@/serverUtil";
import React, { Suspense } from "react";

interface ExerciseBlockSuspenseWrapperProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExerciseBlockSuspenseWrapper(
  props: ExerciseBlockSuspenseWrapperProps,
) {
  const { pageNum } = await parseSearchParams(
    props.searchParams,
    SEARCH_PARSERS.PAGE_NUM,
  );
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Superblocks} />
      <Suspense fallback={<div>Loading...</div>}>
        <PageExerciseSuperblock pageNum={pageNum} />
      </Suspense>
    </React.Fragment>
  );
}
