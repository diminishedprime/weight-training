import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import UpdateUserPreferences from "@/app/preferences/_components/UpdateUserPreferences";

export default async function PreferencesPage() {
  const { userId } = await requireLoggedInUser("/preferences");
  const preferences = await supabaseRPC("get_user_preferences", {
    p_user_id: userId,
  });

  return <UpdateUserPreferences userId={userId} preferences={preferences} />;
}
