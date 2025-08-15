import Superblock_Id_Edit from "@/app/superblocks/[superblock_id]/edit/page";
import * as serverUtil from "@/serverUtil";
import { TestIds } from "@/test-ids";
import { USER_ID } from "@/test/constants";
import { act, render, screen, waitFor } from "@testing-library/react";
import { randomUUID } from "crypto";
import { afterEach, beforeEach, expect, it } from "vitest";
import { commonBeforeEach } from "./test-util";

const supabase = serverUtil.getSupabaseClient();

const dbCleanup = async (userId: string) => {
  // Delete all superblocks
  await supabase.from("exercise_superblock").delete().eq("user_id", userId);
  await supabase.from("exercise_block").delete().eq("user_id", userId);
  await supabase.from("exercises").delete().eq("user_id", userId);
};

const userId = USER_ID["add-block-to-superblock.integration.test.tsx"];
beforeEach(async () => {
  commonBeforeEach("add-block-to-superblock.integration.test.tsx", serverUtil);
  await dbCleanup(userId);
});

afterEach(async () => {
  await dbCleanup(userId);
});

it("should allow a logged in user to add a block to an existing super block with no existing blocks in the db.", async () => {
  const superblockId = randomUUID();
  await supabase.from("exercise_superblock").insert({
    user_id: userId,
    id: superblockId,
    completion_status: "not_started",
    name: "Test Superblock",
  });

  let page = await Superblock_Id_Edit({
    params: Promise.resolve({ superblock_id: superblockId }),
  });

  await act(async () => {
    render(page);
  });

  await act(async () => {
    // Check the FAB is disabled.
    const fab = await waitFor(() =>
      screen.getByTestId(TestIds.Superblocks_SuperblockId_Edit_AddBlock),
    );
    expect(fab).toBeDisabled();
    // Select the first exercise from the exercise selector.
    await waitFor(() =>
      screen.getByRole("button", {
        name: /open/i,
      }),
    ).then((a) => a.click());
    await waitFor(() =>
      screen.getByTestId(TestIds.SelectExercise_Option(0)),
    ).then((a) => a.click());
    // The FAB should not be disabled
    expect(fab).not.toBeDisabled();
    fab.click();
    // Bit of a hack, have to wait for the database entry since I'm using
    // revalidate path, until this work is done, I have nothing else to check in
    // on. Switching over to a "initial-hydration" then mutation to re-render
    // approach will allow this to be cleaned up.
    await waitFor(async () => {
      const { data } = await supabase
        .from("exercise_superblock")
        .select("*")
        .eq("user_id", userId);
      expect(data?.length).toBeGreaterThan(0);
    });
  });

  await act(async () => {
    page = await Superblock_Id_Edit({
      params: Promise.resolve({ superblock_id: superblockId }),
    });
  });

  await act(async () => {
    render(page);
  });

  await waitFor(() => {
    const block = screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Edit_Block(0),
    );
    expect(block).toBeInTheDocument();
  });
});
