import ProgramOverviewType from "@/app/programs/_components/ProgramOverview";
import { ProgramOverviews } from "@/common-types";
import { Stack } from "@mui/material";

interface ProgramsProps {
  programOverviews: ProgramOverviews;
}

const Programs: React.FC<ProgramsProps> = (props) => {
  return (
    <Stack spacing={1}>
      {props.programOverviews.map((program) => (
        <ProgramOverviewType key={program.id} program={program} />
      ))}
    </Stack>
  );
};

export default Programs;
