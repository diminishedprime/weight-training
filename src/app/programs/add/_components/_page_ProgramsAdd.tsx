import ProgramsAddClient from "@/app/programs/add/_components/ProgramsAddClient";
import { GetAddProgramInfoResult } from "@/common-types";
import { PATHS } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
// TODO: use zod in a similiar way to this for the other places we do forms.
import { z } from "zod";

export default async function PageProgramsAdd() {
  const { userId } = await requireLoggedInUser(PATHS.Programs_Add);
  const [formDraft, getAddProgramInfoResult] = await Promise.all([
    getFormDraftF(userId),
    getAddProgramInfoResultF(userId),
  ]);

  return (
    <ProgramsAddClient
      userId={userId}
      formDraft={formDraft}
      getAddProgramInfoResult={getAddProgramInfoResult}
    />
  );
}

const FormDraftSchema = z.object({
  targetMax: z.object({
    squatTargetMax: z.number(),
    benchTargetMax: z.number(),
    deadliftTargetMax: z.number(),
    overheadPressTargetMax: z.number(),
  }),
  programName: z.string(),
  deload: z.boolean(),
});

export type ProgramsAddFormDraft = z.infer<typeof FormDraftSchema> | null;

const getFormDraftF = async (userId: string): Promise<ProgramsAddFormDraft> => {
  const formDraftRaw = await supabaseRPC("get_form_draft", {
    p_user_id: userId,
    p_page_path: PATHS.Programs_Add,
  });
  const parsed = FormDraftSchema.safeParse(formDraftRaw);
  return parsed.success ? parsed.data : null;
};

const getAddProgramInfoResultF = async (userId: string) => {
  const addProgramInfo = await supabaseRPC("get_add_program_info", {
    p_user_id: userId,
  });
  return addProgramInfo as GetAddProgramInfoResult;
};
