import { z } from "zod";

export const FormDraftSchema = z.object({
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
