import { type Props } from "@/components/LabeledValue";
import Typography from "@/components/skeleton/Typography";
import { Stack } from "@mui/material";

export default function LabeledValue(props: Props) {
  return (
    <Stack
      alignItems={props.alignItems || undefined}
      flex={props.flex || undefined}
      width={props.width || undefined}
      onClick={props.onClick}
      sx={props.sx || undefined}
    >
      <Typography
        variant={props.labelVariant || "body2"}
        color={props.labelColor || "text.primary"}
        gutterBottom={props.gutterBottom}
        component="span"
      >
        {props.label}
      </Typography>
      {props.children}
    </Stack>
  );
}
