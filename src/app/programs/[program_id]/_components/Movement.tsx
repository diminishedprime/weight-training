import { ProgramMovement } from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayWeight from "@/components/display/DisplayWeight";
import DisplayWeightChange from "@/components/display/DisplayWeightChange";
import LabeledValue from "@/components/LabeledValue";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { exerciseTypeUIStringBrief } from "@/uiStrings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  movement: ProgramMovement;
}

const Movement: React.FC<Props> = (props) => {
  // TODO: clean up the db to have a completion_status on the public.wendler_program_cycle
  const { movement } = props;
  const completionStatus =
    movement.completed_at !== null
      ? "completed"
      : movement.started_at !== null
        ? "in_progress"
        : "not_started";
  return (
    <Accordion
      key={movement.id}
      defaultExpanded={completionStatus === "in_progress"}
      disableGutters
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 1 }}>
        <Stack direction="row" alignItems="center" width="100%">
          <DisplayCompletionStatus completionStatus={completionStatus} />
          <Typography>
            {exerciseTypeUIStringBrief(movement.exercise_type)}
          </Typography>
          <Stack flexGrow={1} />
          {movement.started_at && (
            <DisplayDate timestamp={movement.started_at} noTime />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        <Stack>
          <Stack direction="row" justifyContent={"space-between"}>
            <LabeledValue label="Training Max" alignItems={"center"}>
              <DisplayWeight
                weightValue={movement.training_max_value}
                weightUnit={movement.weight_unit}
              />
            </LabeledValue>
            <LabeledValue label="Heaviest Weight" alignItems={"center"}>
              <DisplayWeight
                weightValue={movement.heaviest_weight_value}
                weightUnit={movement.weight_unit}
              />
            </LabeledValue>
            <LabeledValue label="Change" alignItems={"center"}>
              <DisplayWeightChange
                changeValue={movement.increase_amount_value}
              />
            </LabeledValue>
          </Stack>
          <TODO>Add in more preview details for the block.</TODO>
          <Stack>
            {movement.superblock_id && (
              <Button
                variant="outlined"
                size="small"
                href={Paths.Superblocks_SuperblockId(movement.superblock_id)}
                sx={{
                  justifySelf: "flex-end",
                  alignSelf: "flex-end",
                }}
              >
                Superblock
              </Button>
            )}
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default Movement;
