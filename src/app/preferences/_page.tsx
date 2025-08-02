import UpdateUserPreferences from "@/app/preferences/_components/UpdateUserPreferences";
import TODO from "@/components/TODO";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import React from "react";

export default async function PreferencesPage() {
  const { userId } = await requireLoggedInUser("/preferences");
  const preferences = await supabaseRPC("get_user_preferences", {
    p_user_id: userId,
  });

  return (
    <React.Fragment>
      <TODO>Update this to use the new wrapper vs page paradigm.</TODO>
      <UpdateUserPreferences userId={userId} preferences={preferences} />
    </React.Fragment>
  );
}
