import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import LiftsTable from "./LiftsTable";

interface LiftsTableWrapperProps {
  userId: string;
  lift_type: Database["public"]["Enums"]["lift_type_enum"];
}

export default async function LiftsTableWrapper({
  userId,
  lift_type,
}: LiftsTableWrapperProps) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const lifts =
    (
      await supabase
        .rpc("get_lifts_by_type_for_user", {
          p_user_id: userId,
          p_lift_type: lift_type,
        })
        .select()
    ).data || [];

  return <LiftsTable lifts={lifts} lift_type={lift_type} />;
}
