import ProgramOverview from "@/app/programs/_components/ProgramOverview";
import { WendlerProgramOverviews } from "@/common-types";
import { Stack } from "@mui/material";

interface ProgramsProps {
  programOverviews: WendlerProgramOverviews;
}

const Programs: React.FC<ProgramsProps> = (props) => {
  return (
    <Stack>
      {props.programOverviews.map((program) => (
        <ProgramOverview key={program.id} program={program} />
      ))}
    </Stack>
  );
};

export default Programs;
