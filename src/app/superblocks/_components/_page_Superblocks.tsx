import SuperblocksClient from "@/app/superblocks/_components/SuperblocksClient";
import { RequiredNonNullable, SuperblocksRow } from "@/common-types";
import { PATHS } from "@/constants";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { notFoundIfNull } from "@/util";
import React from "react";

interface PageSuperblocksProps {
  pageNum: number;
}

// TODO: if this pattern sticks, then refactor the others pages to be named
//
// _components/_page_ComponentName.tsx
export default async function PageSuperblocks(props: PageSuperblocksProps) {
  const { userId } = await requireLoggedInUser(PATHS.Superblocks);
  const { superblocks, pageCount } = await getSuperblocks(
    userId,
    props.pageNum,
  );

  return (
    <React.Fragment>
      <SuperblocksClient
        currentPageNum={props.pageNum}
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
