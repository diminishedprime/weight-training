import PagePrograms from "@/app/programs/_components/_page_Programs";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PATHS } from "@/constants";
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
      <Breadcrumbs pathname={PATHS.Programs} />
      <PagePrograms currentPageNum={pageNum} />
    </Suspense>
  );
}
