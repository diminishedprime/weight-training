import UpdateUserPreferences from "@/app/preferences/_components/UpdateUserPreferences";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";

export default async function PreferencesPage() {
  const { userId } = await requireLoggedInUser("/preferences");
  const preferences = await supabaseRPC("get_user_preferences", {
    p_user_id: userId,
  });

  return <UpdateUserPreferences userId={userId} preferences={preferences} />;
}
