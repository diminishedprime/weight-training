import ProgramClient from "@/app/programs/[program_id]/_components/ProgramClient";
import { GetWendlerProgramResult } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import {
  parseSearchParams,
  requireLoggedInUser,
  SEARCH_PARSERS,
  supabaseRPC,
} from "@/serverUtil";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{ program_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Programs_ProgramId(props: Props) {
  const [{ program_id: programId }] = await Promise.all([
    props.params,
    parseSearchParams(props.searchParams, SEARCH_PARSERS.EDITABLE),
  ]);
  const { userId } = await requireLoggedInUser(
    Paths.Programs_ProgramId(programId),
  );
  const program = await getWendlerProgram(userId, programId);

  return (
    <React.Fragment>
      <Breadcrumbs
        pathname={Paths.Programs_ProgramId(programId)}
        truncate={[programId]}
        nonLinkable={[programId]}
      />
      <ProgramClient program={program} />
    </React.Fragment>
  );
}

const getWendlerProgram = async (userId: string, programId: string) => {
  // TODO: Update this to use a more straightforward rpc:
  // hydrate-programs_program_id
  const program = await supabaseRPC("get_wendler_program", {
    p_user_id: userId,
    p_program_id: programId,
  });
  if (program.id === null) {
    notFound();
  }
  return program as GetWendlerProgramResult;
};
