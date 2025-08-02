import ProgramsClient from "@/app/programs/_components/ProgramsClient";
import { GetWendlerProgramsResult } from "@/common-types";
import { PATHS } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";

interface PageProgramsProps {
  currentPageNum: number;
}
export default async function PagePrograms(props: PageProgramsProps) {
  const { userId } = await requireLoggedInUser(PATHS.Programs);

  const { page_count, program_overviews } = await getWendlerPrograms(
    userId,
    props.currentPageNum,
  );

  return (
    <ProgramsClient
      pageCount={page_count}
      programOverviews={program_overviews}
      currentPageNum={props.currentPageNum}
    />
  );
}

const getWendlerPrograms = async (userId: string, pageNum: number) => {
  const programOverviews = await supabaseRPC("get_wendler_program_overviews", {
    p_user_id: userId,
    p_page_num: pageNum,
  });
  return programOverviews as GetWendlerProgramsResult;
};
