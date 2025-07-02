"use server";

import { ExerciseType } from "@/common-types";
import { Suspense } from "react";
import SetTargetMax from "@/components/SetTargetMax/SetTargetMax";
import { getSupabaseClient } from "@/serverUtil";

interface TargetMaxProps {
  userId: string;
  exerciseType: ExerciseType;
  pathToRevalidate?: string;
}

const ServerWrapper = async (props: TargetMaxProps) => {
  const supabase = getSupabaseClient();
  // TODO - decide what to do with error handling
  const { data, error: _error } = await supabase.rpc("get_wendler_maxes", {
    p_user_id: props.userId,
    p_exercise_type: props.exerciseType,
  });

  return (
    <SetTargetMax
      exerciseType={props.exerciseType}
      userId={props.userId}
      targetMaxValue={data?.target_max_value?.toString() ?? null}
      targetMaxUnit={data?.target_max_unit ?? null}
      personalRecordValue={data?.personal_record_value?.toString() ?? null}
      personalRecordUnit={data?.personal_record_unit ?? null}
      pathToRevalidate={props.pathToRevalidate}
    />
  );
};

const SuspenseWrapper = (props: TargetMaxProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServerWrapper {...props} />
    </Suspense>
  );
};

export default SuspenseWrapper;
