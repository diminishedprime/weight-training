import * as React from "react";
import { Typography, Stack } from "@mui/material";
import WendlerBlockRow from "@/app/exercise-block/[exercise_block_id]/_components/WendlerBlockRow";
import BarbellEditor from "@/components/BarbellEditor";
import { CompletionStatus, RoundingMode, WendlerBlock } from "@/common-types";

export interface WendlerBlockRowInactiveProps {
  setName: string;
  row: WendlerBlock[number];
  availablePlates: number[];
  completionStatusUIString?: (status: CompletionStatus) => string;
}

const WendlerBlockRowInactive: React.FC<WendlerBlockRowInactiveProps> = ({
  setName,
  row,
  availablePlates,
  completionStatusUIString,
}) => (
  <WendlerBlockRow setName={setName} highlight={false}>
    <Stack
      direction="row"
      sx={{
        display: "grid",
        gridTemplateRows: "auto auto",
        gridTemplateColumns: "1fr 1fr 1fr 2fr",
        gap: 1,
      }}>
      <Stack sx={{ gridColumn: "1 / span 4", justifySelf: "center" }}>
        <BarbellEditor
          targetWeight={row.actual_weight_value!}
          barWeight={45}
          availablePlates={availablePlates}
          weightUnit={row.weight_unit!}
          onTargetWeightChange={() => {}}
          onClickWeight={() => {}}
          roundingMode={RoundingMode.NEAREST}
        />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ gridColumn: "4 / span 1" }}>
        {(row.completion_status === "completed" ||
          row.completion_status === "failed" ||
          row.completion_status === "skipped") && (
          <Typography>
            {completionStatusUIString
              ? completionStatusUIString(row.completion_status!)
              : row.completion_status}
          </Typography>
        )}
        <Typography sx={{ whiteSpace: "pre-line" }}>
          {row.notes || ""}
        </Typography>
      </Stack>
    </Stack>
  </WendlerBlockRow>
);

export default WendlerBlockRowInactive;
