import Typography from "@/components/skeleton/Typography";
import { Skeleton, Step, StepButton, Stepper } from "@mui/material";

interface Props {
  stepNames: string[];
}

export default function HorizontalStepper(props: Props) {
  return (
    <Stepper
      sx={{
        "& .MuiStep-root:first-of-type": { paddingLeft: 0 },
        "& .MuiStep-root:last-of-type": { paddingRight: 0 },
      }}
    >
      {props.stepNames.map((stepName, idx) => (
        <Step key={idx}>
          <StepButton
            icon={<Skeleton variant="circular" width={24} height={24} />}
          >
            <Typography>{stepName}</Typography>
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
}
