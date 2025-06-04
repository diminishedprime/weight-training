import { Constants, Database } from "@/database.types";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { addRandomLiftAction } from "./actions";
import AddRandomLiftButton from "./AddRandomLiftButton";
import LiftsTableWrapper from "./LiftsTableWrapper";
import { Suspense } from "react";

export default async function Home({
  params,
}: {
  params: Promise<{ lift_type: string }>;
}) {
  const session = auth();
  const { lift_type: unnarrowed_lift_type } = await params;

  if (
    Constants.public.Enums.lift_type_enum.find(
      (a) => a === unnarrowed_lift_type
    ) === undefined
  ) {
    // redirect to 404 page
    return notFound();
  }

  const lift_type =
    unnarrowed_lift_type as Database["public"]["Enums"]["lift_type_enum"];

  const id = (await session)?.user?.id;
  if (!id) {
    // TODO - actually make a signin page.
    redirect("/login");
  }

  return (
    <div>
      <AddRandomLiftButton
        addRandomLift={addRandomLiftAction.bind(null, lift_type)}
      />
      <Suspense fallback={<div>Loading lifts...</div>}>
        <LiftsTableWrapper userId={id} lift_type={lift_type} />
      </Suspense>
    </div>
  );
}
