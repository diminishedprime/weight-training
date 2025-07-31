import PagePrograms from "@/app/programs/_components/_page_Programs";
import Breadcrumbs from "@/components/Breadcrumbs";
import TODO from "@/components/TODO";
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

      <TODO>
        I think I can massively simplify this component since the program
        component is where the main stuff is. We should also be able to simplify
        the RPC, too.
      </TODO>
      <TODO>
        We want to have a "new program" button that takes you to a new page
        where you can configure the program, target max, whether or not you're
        doing a deload, etc. That should store the form state via the db, and
        then on submit should take you to the programbyid page. OnSubmit should
        also call an RPC that takes all the arguments to create a whole
        planned-out program, complete with superblocks.
      </TODO>
      <TODO>
        Maybe to make this easier to launch, we can just have the superblock
        contain the wendler lift, and have some UI where users can easily add in
        other blocks.
      </TODO>
      <PagePrograms currentPageNum={pageNum} />
    </Suspense>
  );
}
