import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import ExercisesTable from "@/app/exercise/[exercise_type]/_components/ExercisesTable";

interface ExercisesTableWrapperProps {
  userId: string;
  lift_type: Database["public"]["Enums"]["exercise_type_enum"];
}

export default async function ExercisesTableWrapper({
  userId,
  lift_type,
}: ExercisesTableWrapperProps) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const lifts =
    (
      await supabase
        .rpc("get_exercises_by_type_for_user", {
          p_user_id: userId,
          p_exercise_type: lift_type,
        })
        .select()
    ).data || [];

  return <ExercisesTable exercises={lifts} exercise_type={lift_type} />;
}
