"use server";
import { Database } from "@/database.types";

export async function addLegDaySuperblock(
  training_max: number,
  wendler_cycle: Database["public"]["Enums"]["wendler_cycle_type_enum"],
  _: FormData
) {
  "use server";
  const { createClient } = await import("@supabase/supabase-js");
  const { revalidatePath } = await import("next/cache");
  const { auth } = await import("@/auth");
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("User ID is required");
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { error } = await supabase.rpc("add_leg_day_superblock", {
    p_user_id: id,
    p_training_max: training_max,
    p_wendler_cycle: wendler_cycle,
  });

  if (error) {
    return { error: error.message };
  } else {
    revalidatePath(`/superblock`);
    return { success: true };
  }
}
