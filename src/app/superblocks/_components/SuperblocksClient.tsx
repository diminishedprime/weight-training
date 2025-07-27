"use client";
import SuperblocksTable from "@/app/superblocks/_components/SuperblocksTable";
import { type NarrowedSuperblocksRow } from "@/app/superblocks/_components/_page_Superblocks";
import Pagination from "@/components/Pagination";
import { PATHS } from "@/constants";
import { Stack } from "@mui/material";

interface SuperblocksClientProps {
  currentPageNum: number;
  pageCount: number;
  superblocks: NarrowedSuperblocksRow[];
}

// TODO: I'm not really happy with this whole thing needing to be a client
// component when it's really just the pagination that needs to happen
// client-side. I should explore if there's a better way to handle this. Maybe
// it's just _only_ making the Pagination being a client component or maybe
// there's a way to make hrefFor work as a server component if handled
// correctly.
const SuperblocksClient: React.FC<SuperblocksClientProps> = (props) => {
  return (
    <Stack spacing={1}>
      <Pagination
        page={props.currentPageNum}
        count={props.pageCount}
        hrefFor={(pageNum) => PATHS.PaginatedSuperblocks(pageNum)}
      />
      <SuperblocksTable superblocks={props.superblocks} />
      <Pagination
        page={props.currentPageNum}
        count={props.pageCount}
        hrefFor={(pageNum) => PATHS.PaginatedSuperblocks(pageNum)}
      />
    </Stack>
  );
};

export default SuperblocksClient;
