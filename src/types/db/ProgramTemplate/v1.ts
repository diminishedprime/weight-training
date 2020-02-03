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

// TODO - this is the one that should be rendered, not the one that I currently
// have. I should pull out all the table & row functions into a react component
// that has a ProgramTemplate.
export interface ProgramTemplate {
  title: string;
  exercises: Array<ExerciseTemplate>;
  version: "1";
}
