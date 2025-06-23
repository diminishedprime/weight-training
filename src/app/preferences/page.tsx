import { auth } from "@/auth";
import { requireId, getSupabaseClient } from "@/util";
import PreferencesClient from "./_components/PreferencesClient";

export default async function PreferencesPage() {
  const session = await auth();
  const userId = requireId(session, "/preferences");

  const supabase = getSupabaseClient();

  // Use the database function to get all preference data in one query
  const { data: preferencesData } = await supabase.rpc("get_user_preferences", {
    target_user_id: userId,
  });

  return (
    <PreferencesClient
      userId={userId}
      userPreferencesRows={preferencesData || []}
    />
  );
}
