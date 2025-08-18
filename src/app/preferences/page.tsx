"use server";

import PreferencesClient from "@/app/preferences/_components/PreferencesClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import React from "react";

export default async function Preferences() {
  const { userId } = await requireLoggedInUser("/preferences");
  const preferences = await supabaseRPC("get_user_preferences", {
    p_user_id: userId,
  });
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Preferences} />
      <PreferencesClient userId={userId} preferences={preferences} />
    </React.Fragment>
  );
}
