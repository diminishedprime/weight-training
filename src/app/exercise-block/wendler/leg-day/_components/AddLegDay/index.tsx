"use client";

import React from "react";
import Stack from "@mui/material/Stack";
import { WendlerBlockPrereqs, WendlerMaxesData } from "@/common-types";
import { Button } from "@mui/material";
import { TestIds } from "@/test-ids";
import AddIcon from "@mui/icons-material/Add";
import SetTargetMax from "@/components/SetTargetMax/SetTargetMax";
import { addLegDay } from "@/app/exercise-block/wendler/leg-day/_components/AddLegDay/actions";
import WendlerCycleSelector from "@/components/WendlerCycleSelector";

interface AddLegDayProps {
  userId: string;
  pathToRevalidate: string;
  prereqs: WendlerBlockPrereqs;
  wendlerMaxesData: WendlerMaxesData;
}

import { WendlerCycleType } from "@/common-types";
import { useState, useCallback } from "react";

const useAddLegDayAPI = (_props: AddLegDayProps) => {
  const [cycle, setCycle] = useState<WendlerCycleType>("5");
  const handleCycleChange = useCallback((newCycle: WendlerCycleType | null) => {
    if (newCycle) setCycle(newCycle);
  }, []);
  return {
    cycle,
    handleCycleChange,
  };
};

const AddLegDay: React.FC<AddLegDayProps> = (props) => {
  const api = useAddLegDayAPI(props);
  return (
    <Stack spacing={1}>
      <SetTargetMax
        exerciseType={"barbell_back_squat"}
        userId={props.userId}
        targetMaxValue={
          props.wendlerMaxesData.target_max_value?.toString() ?? null
        }
        targetMaxUnit={props.wendlerMaxesData.target_max_unit ?? null}
        personalRecordValue={
          props.wendlerMaxesData.personal_record_value?.toString() ?? null
        }
        personalRecordUnit={props.wendlerMaxesData.personal_record_unit ?? null}
        pathToRevalidate="/exercise-block/wendler/leg-day"
      />
      {!!props.prereqs.is_target_max_set && (
        <Stack spacing={1}>
          <form
            action={addLegDay.bind(
              null,
              props.userId,
              api.cycle,
              props.pathToRevalidate
            )}>
            <Stack spacing={1}>
              <WendlerCycleSelector
                initialCycle={api.cycle}
                onChange={api.handleCycleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                data-testid={TestIds.addWendlerLegDayButton}>
                Add Leg Day
              </Button>
            </Stack>
          </form>
        </Stack>
      )}
    </Stack>
  );
};

export default AddLegDay;
