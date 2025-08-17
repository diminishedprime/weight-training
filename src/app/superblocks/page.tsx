import SuperblocksClient from "@/app/superblocks/_components/SuperblocksClient";
import { RequiredNonNullable, SuperblocksRow } from "@/common-types";
import Breadcrumbs from "@/components/Breadcrumbs";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import {
  parseSearchParams,
  requireLoggedInUser,
  SEARCH_PARSERS,
  supabaseRPC,
} from "@/serverUtil";
import { notFoundIfNull } from "@/util";
import React from "react";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Superblocks(props: Props) {
  const { pageNum } = await parseSearchParams(
    props.searchParams,
    SEARCH_PARSERS.PAGE_NUM,
  );
  const { userId } = await requireLoggedInUser(Paths.Superblocks);
  const { superblocks, pageCount } = await getSuperblocks(userId, pageNum);

  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Superblocks} />
      <TODO>
        We should show the "non-started" superblocks here, first. This means
        mostly just to not exclude the ones without as started_at date.
        <br />
        <br />
        In general, though, we may need to add "completion_status" to the
        programs, cycles, and movements...
      </TODO>
      <SuperblocksClient
        currentPageNum={pageNum}
        pageCount={pageCount}
        superblocks={superblocks}
      />
    </React.Fragment>
  );
}

// lmao, at least the autocomplete works.
export type NarrowedSuperblocksRow = RequiredNonNullable<
  Omit<SuperblocksRow, "block_details"> & {
    block_details: RequiredNonNullable<
      NonNullable<SuperblocksRow["block_details"]>[number],
      "id" | "exercise_type"
    >[];
  },
  | "id"
  | "user_id"
  | "started_at"
  | "completed_at"
  | "block_details"
  | "training_volume"
>;

const getSuperblocks = async (userId: string, pageNum: number) => {
  const result = await supabaseRPC("get_superblocks", {
    p_user_id: userId,
    p_page_num: pageNum,
  });
  notFoundIfNull(result.page_count);
  notFoundIfNull(result.superblocks);
  return {
    superblocks: result.superblocks as NarrowedSuperblocksRow[],
    pageCount: result.page_count,
  };
};
