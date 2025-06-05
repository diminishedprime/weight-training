import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Suspense } from "react";
import EditLiftForm from "./EditLiftForm";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Database } from "@/database.types";
import { getSupabaseClient, liftTypeUIString, requireId } from "@/util";

export default async function EditLiftPage({
  params,
}: {
  params: Promise<{
    lift_id: string;
    lift_type: Database["public"]["Enums"]["lift_type_enum"];
  }>;
}) {
  const [session, { lift_id, lift_type }] = await Promise.all([auth(), params]);
  const user_id = requireId(session, `/exercise/${lift_type}/edit/${lift_id}`);

  const supabase = getSupabaseClient();
  const { data: lift, error } = await supabase.rpc("get_lift_for_user", {
    p_user_id: user_id,
    p_lift_id: lift_id,
  });
  if (error) throw new Error(error.message);
  // TODO - this could use some work. My stored proc doesn't really work right here type-wise.
  if (!lift.lift_id) notFound();

  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Edit {liftTypeUIString(lift_type)}
      </Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <EditLiftForm lift={lift} user_id={user_id} />
      </Suspense>
    </Stack>
  );
}
