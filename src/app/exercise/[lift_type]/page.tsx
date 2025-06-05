import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Constants, Database } from "@/database.types";
import { auth } from "@/auth";
import { requireId } from "@/util";
import { notFound } from "next/navigation";
import { addRandomLiftAction } from "./actions";
import AddRandomLiftButton from "./AddRandomLiftButton";
import LiftsTableWrapper from "./LiftsTableWrapper";
import { Suspense } from "react";
import { liftTypeUIString } from "@/util";

export default async function Home({
  params,
}: {
  params: Promise<{ lift_type: string }>;
}) {
  const { lift_type: unnarrowed_lift_type } = await params;

  if (
    Constants.public.Enums.lift_type_enum.find(
      (a) => a === unnarrowed_lift_type
    ) === undefined
  ) {
    return notFound();
  }

  const lift_type =
    unnarrowed_lift_type as Database["public"]["Enums"]["lift_type_enum"];

  const session = await auth();
  const id = requireId(session, `/exercise/${lift_type}`);

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {liftTypeUIString(lift_type)} Lifts
      </Typography>
      <AddRandomLiftButton
        addRandomLift={addRandomLiftAction.bind(null, lift_type)}
      />
      <Suspense fallback={<div>Loading lifts...</div>}>
        <LiftsTableWrapper userId={id} lift_type={lift_type} />
      </Suspense>
    </Stack>
  );
}
