import { auth } from "@/auth";
import Breadcrumbs from "@/components/Breadcrumbs";
import { requireId } from "@/util";
import { Stack, Typography } from "@mui/material";
import AddLegDay from "@/app/superblock/_components/AddLegDay";
import SuperblockTableWrapper from "@/app/superblock/_components/SuperblockTableWrapper";
import NewSuperblock from "@/app/superblock/_components/NewSuperblock/index";

export default async function SuperblockPage() {
  const session = await auth();
  const userId = requireId(session, "/superblock");
  return (
    <>
      <Breadcrumbs pathname="/superblock" />
      <Typography variant="h4">Superblocks</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Superblocks are a collections of exercises blocks. Think of them as an
        entire day of exercises, such as a &ldquo;leg day&rdquo; or a
        &ldquo;push day&rdquo;.
      </Typography>
      <Stack spacing={1}>
        <NewSuperblock />
        <AddLegDay />
      </Stack>
      <SuperblockTableWrapper userId={userId} />
    </>
  );
}
