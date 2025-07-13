"use server";

import { getSupabaseClient, requireLoggedInUser } from "@/serverUtil";
import React, { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import UpdateUserPreferences from "@/app/preferences/_components/UpdateUserPreferences";

const PreferencesPage = async () => {
  const { userId } = await requireLoggedInUser("/preferences");
  const supabase = getSupabaseClient();
  const { data: preferences, error } = await supabase.rpc(
    "get_user_preferences",
    {
      p_user_id: userId,
    }
  );

  if (error) {
    throw new Error("Error fetching user preferences");
  }

  console.log({ preferences });

  return <UpdateUserPreferences userId={userId} preferences={preferences} />;
};

export default async function SuspenseWrapper() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname="/preferences" />
      <Suspense fallback={<div>Loading preferences...</div>}>
        <PreferencesPage />
      </Suspense>
    </React.Fragment>
  );
}
