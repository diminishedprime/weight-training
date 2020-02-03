enum ExerciseTemplateType {
  Barbell = "barbell",
  ProgramNotes = "program-notes"
}

interface ProgramNotesTemplate {
  type: ExerciseTemplateType.ProgramNotes;
  note: string;
}

interface BarbellTemplate {
  type: ExerciseTemplateType.Barbell;
  ormPercentage: number;
  reps: number;
  note?: string;
}

type ExerciseTemplate = BarbellTemplate | ProgramNotesTemplate;

export interface ProgramTemplate {
  title: string;
  exercises: Array<ExerciseTemplate>;
  version: "1";
}
