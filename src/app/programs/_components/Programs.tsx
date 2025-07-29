import ProgramOverview from "@/app/programs/_components/ProgramOverview";
import { RNNProgram } from "@/common-types";
import { Stack } from "@mui/material";

interface ProgramsProps {
  programs: RNNProgram[];
}

const Programs: React.FC<ProgramsProps> = (props) => {
  return (
    <Stack spacing={1}>
      {props.programs.map((program) => (
        <ProgramOverview key={program.id} program={program} />
      ))}
    </Stack>
  );
};

export default Programs;
