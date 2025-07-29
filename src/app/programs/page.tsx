import PagePrograms from "@/app/programs/_components/_page_Programs";
import { parseSearchParams, SEARCH_PARSERS } from "@/serverUtil";
import { Suspense } from "react";

interface ProgramsSuspenseWrapperProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProgramsSuspenseWrapper(
  props: ProgramsSuspenseWrapperProps,
) {
  const { pageNum } = await parseSearchParams(
    props.searchParams,
    SEARCH_PARSERS.PAGE_NUM,
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PagePrograms currentPageNum={pageNum} />
    </Suspense>
  );
}
