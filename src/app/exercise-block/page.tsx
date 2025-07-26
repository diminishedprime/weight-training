import PageExerciseBlock from "@/app/exercise-block/_components/PageExerciseBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
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
      <Breadcrumbs
        pathname="/exercise-block"
        labels={{ "/exercise-block": "Exercise Block" }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PageExerciseBlock pageNum={pageNum} />
      </Suspense>
    </React.Fragment>
  );
}
