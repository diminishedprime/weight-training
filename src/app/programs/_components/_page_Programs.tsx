import ProgramsClient from "@/app/programs/_components/ProgramsClient";
import { RNNGetWendlerProgramsResult } from "@/common-types";
import { PATHS } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";

interface PageProgramsProps {
  currentPageNum: number;
}
export default async function PagePrograms(props: PageProgramsProps) {
  const { userId } = await requireLoggedInUser(PATHS.Programs);

  const { page_count, programs } = await getWendlerPrograms(
    userId,
    props.currentPageNum,
  );

  return (
    <ProgramsClient
      pageCount={page_count}
      programs={programs}
      currentPageNum={props.currentPageNum}
    />
  );
}

const getWendlerPrograms = async (userId: string, pageNum: number) => {
  const programs = await supabaseRPC("get_wendler_programs", {
    p_user_id: userId,
    p_page_num: pageNum,
  });
  return programs as RNNGetWendlerProgramsResult;
};
