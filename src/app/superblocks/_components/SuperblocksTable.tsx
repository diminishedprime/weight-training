"use client";

import { NarrowedSuperblocksRow } from "@/app/superblocks/_components/_page_Superblocks";
import SuperblocksRow from "@/app/superblocks/_components/SuperblocksRow";
import { Stack } from "@mui/material";
import { NextIntlClientProvider } from "next-intl";

interface SuperblockTableProps {
  superblocks: NarrowedSuperblocksRow[];
}

const SuperblockTable: React.FC<SuperblockTableProps> = (props) => {
  // TODO: I don't know if I can safely put this client provider at the root
  // level of this app or not.
  return (
    <Stack spacing={1}>
      <NextIntlClientProvider locale={navigator.language}>
        {props.superblocks.map((superblock) => (
          <SuperblocksRow key={superblock.id} superblock={superblock} />
        ))}
      </NextIntlClientProvider>
    </Stack>
  );
};

export default SuperblockTable;
