import { auth } from "@/auth";
import Breadcrumbs from "@/components/Breadcrumbs";
import { requireId } from "@/util";
import { Typography } from "@mui/material";
import Link from "next/link";
import AddLegDay from "./AddLegDay";
import SuperblockTableWrapper from "./SuperblockTableWrapper";

export default async function SuperblockPage() {
  const session = await auth();
  const userId = requireId(session, "/superblock");
  return (
    <>
      <Breadcrumbs pathname="/superblock" />
      <Typography variant="h4">Superblocks</Typography>
      <Typography variant="body1">
        Create superblocks. i.e. a full set of exercises for a day.
      </Typography>
      <AddLegDay />
      <SuperblockTableWrapper userId={userId} />
    </>
  );
}
