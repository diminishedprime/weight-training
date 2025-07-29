import { RNNProgram } from "@/common-types";
import DisplayDate from "@/components/display/DisplayDate";
import DisplayWeight from "@/components/display/DisplayWeight";
import { exerciseTypeUIStringBrief, wendlerCycleUIString } from "@/uiStrings";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DragArrowIcon from "@mui/icons-material/DragHandle";
import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";

interface ProgramOverviewProps {
  program: RNNProgram;
}

const ProgramOverview: React.FC<ProgramOverviewProps> = (props) => {
  return (
    <Stack spacing={1}>
      <Typography variant="h6">
        {props.program.name}
        {props.program.started_at && (
          <DisplayDate
            timestamp={props.program.started_at}
            noTime
          ></DisplayDate>
        )}
      </Typography>
      {props.program.notes && (
        <Typography variant="body2" color="textSecondary">
          {props.program.notes}
        </Typography>
      )}
      <Stack spacing={0}>
        {props.program.movements.map((movement) => (
          <React.Fragment key={movement.id}>
            <Stack spacing={1} mb={0.5}>
              <Stack spacing={1} direction="row" justifyContent="space-between">
                <Typography variant="h6" fontSize="1.1rem">
                  {exerciseTypeUIStringBrief(movement.exercise_type)}
                </Typography>
                <DisplayWeight
                  startAdornment={"target max\u00A0"}
                  sx={{ fontWeight: "regular" }}
                  weightValue={movement.training_max_value}
                  weightUnit={movement.weight_unit}
                />
                <DisplayWeight
                  startAdornment={"change\u00A0"}
                  weightValue={movement.increase_amount_value}
                  weightUnit={movement.weight_unit}
                  endAdornment={
                    movement.increase_amount_value > 0 ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : movement.increase_amount_value === 0 ? (
                      <DragArrowIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )
                  }
                />
              </Stack>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                {movement.blocks.map((block) => (
                  <Stack key={block.id} spacing={0}>
                    <Typography variant="body1">
                      {wendlerCycleUIString(block.cycle_type)}
                    </Typography>
                    <DisplayWeight
                      valueColor="unset"
                      weightUnit={movement.weight_unit}
                      weightValue={block.heaviest_weight_value}
                    />
                  </Stack>
                ))}
              </Box>
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default ProgramOverview;
