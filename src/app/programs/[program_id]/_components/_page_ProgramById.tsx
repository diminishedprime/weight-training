import ProgramClient from "@/app/programs/[program_id]/_components/ProgramClient";
import { GetWendlerProgramResult } from "@/common-types";
import { PATHS } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { notFound } from "next/navigation";

interface PageProgramByIdProps {
  editable: boolean;
  programId: string;
}
export default async function PageProgramById(props: PageProgramByIdProps) {
  const { userId } = await requireLoggedInUser(
    PATHS.ProgramById(props.programId),
  );

  const program = await getWendlerProgram(userId, props.programId);

  return <ProgramClient program={program} />;
}

const getWendlerProgram = async (userId: string, programId: string) => {
  const program = await supabaseRPC("get_wendler_program", {
    p_user_id: userId,
    p_program_id: programId,
  });
  if (program.id === null) {
    notFound();
  }
  return program as GetWendlerProgramResult;
};
