import RestTimesClient from "@/app/preferences/rest-times/_components/RestTimesClient";
import { HydrateRestTimes } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import React from "react";

export default async function Preferences_RestTimes() {
  const { userId } = await requireLoggedInUser(Paths.Preferences_RestTimes);
  const equipmentRestTimes = await hydrateEquipmentRestTimes(userId);
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Preferences_RestTimes} />
      <RestTimesClient
        userId={userId}
        hydratedEquipmentRestTimes={equipmentRestTimes}
      />
    </React.Fragment>
  );
}

const hydrateEquipmentRestTimes = async (userId: string) => {
  const equipmentRestTimes = await supabaseRPC("hydrate_rest_times", {
    p_user_id: userId,
  });
  return equipmentRestTimes as HydrateRestTimes;
};
