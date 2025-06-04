import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Suspense } from "react";
import EditLiftForm from "../../../[lift_type]/edit/[lift_id]/EditLiftForm";
import { Database } from "@/database.types";

export default async function EditLiftPage({
  params,
}: {
  params: { lift_id: string };
}) {
  const session = await auth();
  const user_id = session?.user?.id;
  if (!user_id) redirect("/login");

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: lift, error } = await supabase.rpc("get_lift_for_user", {
    p_user_id: user_id,
    p_lift_id: params.lift_id,
  });
  if (error) throw new Error(error.message);
  if (!lift) notFound();

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Deadlift</h1>
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <EditLiftForm lift={lift} user_id={user_id} />
      </Suspense>
    </div>
  );
}
