"use server";

import { requireLoggedInUser, getSupabaseClient } from "@/serverUtil";
import PreferencesClient from "./_components/PreferencesClient";
import { Constants, Database } from "@/database.types";
import { correspondingEquipment } from "@/util";

const equipmentToNum: Record<
  Database["public"]["Enums"]["equipment_type_enum"],
  number
> = Constants.public.Enums.equipment_type_enum
  .map((a, idx) => ({ [a]: idx }))
  .reduce((a, b) => ({ ...a, ...b }), {}) as never as Record<
  Database["public"]["Enums"]["equipment_type_enum"],
  number
>;

export default async function PreferencesPage() {
  const { userId } = await requireLoggedInUser("/preferences");

  const supabase = getSupabaseClient();

  // Use the database function to get all preference data in one query
  const { data: preferencesData } = await supabase.rpc("get_user_preferences", {
    p_user_id: userId,
  });

  preferencesData?.sort((a, b) => {
    let a_equipment = correspondingEquipment(a.exercise_type!);
    let b_equipment = correspondingEquipment(b.exercise_type!);
    const aNum = equipmentToNum[a_equipment];
    const bNum = equipmentToNum[b_equipment];
    if (aNum < bNum) return -1;
    if (aNum > bNum) return 1;
    // If equipment is the same, sort alphabetically by exercise_type
    if (a.exercise_type! < b.exercise_type!) return -1;
    if (a.exercise_type! > b.exercise_type!) return 1;
    return 0;
  });

  return <PreferencesClient userPreferencesRows={preferencesData || []} />;
}
