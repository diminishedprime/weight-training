"use server";
import { Constants, Database } from "@/database.types";
import { correspondingEquipment } from "@/util";

export async function addRandomLiftAction(
  liftType: Database["public"]["Enums"]["exercise_type_enum"],
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
  const response = await supabase.rpc("create_exercise", {
    p_user_id: id,
    p_exercise_type: liftType,
    p_weight_value: Math.floor(Math.random() * 450) + 10,
    p_weight_unit: "pounds" as Database["public"]["Enums"]["weight_unit_enum"],
    p_reps: Math.floor(Math.random() * 10) + 1,
    p_equipment_type: correspondingEquipment(liftType),
    p_completion_status:
      Constants.public.Enums.completion_status_enum[
        (Math.random() * Constants.public.Enums.completion_status_enum.length) |
          0
      ],
    p_relative_effort:
      Constants.public.Enums.relative_effort_enum[
        (Math.random() * Constants.public.Enums.relative_effort_enum.length) | 0
      ],
    p_warmup: Math.random() < 0.5,
  });
  console.log({ response });
  revalidatePath(`/exercise/${liftType}`);
}
