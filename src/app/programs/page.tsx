import ProgramsClient from "@/app/programs/_components/ProgramsClient";
import { GetWendlerProgramsResult } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import {
  parseSearchParams,
  requireLoggedInUser,
  SEARCH_PARSERS,
  supabaseRPC,
} from "@/serverUtil";
import React from "react";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Programs(props: Props) {
  const { pageNum } = await parseSearchParams(
    props.searchParams,
    SEARCH_PARSERS.PAGE_NUM,
  );

  const { userId } = await requireLoggedInUser(Paths.Programs);

  const { page_count, program_overviews } = await getWendlerPrograms(
    userId,
    pageNum,
  );
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Programs} />
      <ProgramsClient
        pageCount={page_count}
        programOverviews={program_overviews}
        currentPageNum={pageNum}
      />
    </React.Fragment>
  );
}

const getWendlerPrograms = async (userId: string, pageNum: number) => {
  const programOverviews = await supabaseRPC("get_wendler_program_overviews", {
    p_user_id: userId,
    p_page_num: pageNum,
  });
  return programOverviews as GetWendlerProgramsResult;
};
