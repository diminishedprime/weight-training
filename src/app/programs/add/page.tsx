import { getProgramsAddFormDraft } from "@/app/programs/add/_components/actions";
import ProgramsAddClient from "@/app/programs/add/_components/ProgramsAddClient";
import { GetAddProgramInfoResult } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import React from "react";

export default async function Programs_Add() {
  const { userId } = await requireLoggedInUser(Paths.Programs_Add);
  const [formDraft, getAddProgramInfoResult] = await Promise.all([
    getProgramsAddFormDraft(userId),
    getAddProgramInfoResultF(userId),
  ]);
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Programs_Add} />
      <ProgramsAddClient
        userId={userId}
        formDraft={formDraft}
        getAddProgramInfoResult={getAddProgramInfoResult}
      />
    </React.Fragment>
  );
}

const getAddProgramInfoResultF = async (userId: string) => {
  const addProgramInfo = await supabaseRPC("get_add_program_info", {
    p_user_id: userId,
  });
  return addProgramInfo as GetAddProgramInfoResult;
};
