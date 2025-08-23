import Superblocks_SuperblockId_Perform from "@/app/superblocks/[superblock_id]/perform/page";
import { GetPerformSuperblockResult } from "@/common-types";
import * as serverUtil from "@/serverUtil";
import { USER_ID } from "@/test/constants";
import { TestIds } from "@/test/test-ids";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import { fail } from "assert";
import { randomUUID } from "crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { commonBeforeEach } from "./test-util";

// Mock DisplayStopwatch for this test only
vi.mock("@/components/display/DisplayStopwatch", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-stopwatch" />,
}));

vi.mock("canvas-confetti", () => ({
  __esModule: true,
  default: () => <div />,
}));

const supabase = serverUtil.getSupabaseClient();

const dbCleanup = async (userId: string) => {
  // Delete all superblocks and related blocks/exercises
  await supabase.from("exercise_superblock").delete().eq("user_id", userId);
  await supabase.from("exercise_block").delete().eq("user_id", userId);
  await supabase.from("exercises").delete().eq("user_id", userId);

  // Delete Wendler program data for the user
  await supabase
    .from("wendler_program_cycle_movement")
    .delete()
    .eq("user_id", userId);
  await supabase.from("wendler_program_cycle").delete().eq("user_id", userId);
  await supabase.from("wendler_program").delete().eq("user_id", userId);
};

const userKey = "perform-entire-superblock.integration.test.tsx";
const userId = USER_ID[userKey];
beforeEach(async () => {
  commonBeforeEach(userKey, serverUtil);
  await dbCleanup(userId);
});

afterEach(async () => {
  await dbCleanup(userId);
});

it("Can perform an entire superblock with 1 exercise block finishing every row", async () => {
  const blockName = "Test Block finish every row";
  const superblockId = await addSuperblockAndBlock(blockName);

  let page = await Superblocks_SuperblockId_Perform({
    params: Promise.resolve({ superblock_id: superblockId }),
  });

  await act(async () => {
    render(page);
  });

  // Ensure the block starts off in the not started state.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);

  // Finish the first set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__FinishExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the first row to be completed in the ui.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(0),
    ),
  );

  // Ensure the block is now in progress.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusInProgress);

  // Finish the second set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__FinishExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the second row to be completed in the UI.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(1),
    ),
  );

  // Finish the third set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__FinishExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the third row to be completed in the UI.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(2),
    ),
  );

  // Ensure the block is now showing up as completed.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusCompleted);
});

it("Can perform an entire superblock with 1 exercise block skipping every row", async () => {
  const blockName = "My test block";
  const superblockId = await addSuperblockAndBlock(blockName);

  let page = await Superblocks_SuperblockId_Perform({
    params: Promise.resolve({ superblock_id: superblockId }),
  });

  await act(async () => {
    render(page);
  });

  // Ensure the block starts off in the not started state.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);

  // Skip the first set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__SkipExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the first row to be skipped in the ui.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__NotStartedExerciseRow(0),
    ),
  );

  // The block should now be in progress.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusInProgress);

  // Skip the second set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__SkipExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the second row to be completed in the UI.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__NotStartedExerciseRow(1),
    ),
  );

  // Skip the third set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__SkipExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the third row to be completed in the UI.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__NotStartedExerciseRow(2),
    ),
  );

  // Ensure the block is now showing up as completed.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusCompleted);
});

it("Can perform an entire superblock with 1 exercise block failing every row", async () => {
  const blockName = "My test block";
  const superblockId = await addSuperblockAndBlock(blockName);

  let page = await Superblocks_SuperblockId_Perform({
    params: Promise.resolve({ superblock_id: superblockId }),
  });

  await act(async () => {
    render(page);
  });

  // Ensure the block starts off in the not started state.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);

  // Skip the first set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__FailExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the first row to be failed in the ui.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(0),
    ),
  );

  // The block should now be in progress.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusInProgress);

  // Fail the second set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__FailExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the second row to be completed in the UI.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(1),
    ),
  );

  // Skip the third set
  await act(async () => {
    await waitFor(() =>
      screen.getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__FailExercise,
      ),
    ).then((a) => a.click());
  });

  // Wait for the third row to be completed in the UI.
  await waitFor(() =>
    screen.getByTestId(
      TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(2),
    ),
  );

  // Ensure the block is now showing up as completed.
  within(
    screen.getByRole("button", {
      name: blockName,
    }),
  ).getByTestId(TestIds.CompletionStatusCompleted);
});

it("Can perform an entire superblock based of a realistic program finishing every row", async () => {
  const absBlockName = "Abs Block";
  const legCurlBlockName = "Leg Curl Block";
  const superblockId = await addProgramAndBlocks(
    absBlockName,
    legCurlBlockName,
  );

  let page = await Superblocks_SuperblockId_Perform({
    params: Promise.resolve({ superblock_id: superblockId }),
  });

  await act(async () => {
    render(page);
  });

  // To keep this test from being wayyyy too long, we're going to use a bit of
  // iteration.
  const baseSuperblock: GetPerformSuperblockResult =
    await serverUtil.supabaseRPC("get_perform_superblock", {
      p_superblock_id: superblockId,
      p_user_id: userId,
    });

  // First, check that the superblock & blocks are all not_started in the UI.
  // Superblock
  within(
    screen.getByRole("heading", {
      name: /leg day/i,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);
  // Abs
  within(
    screen.getByRole("button", {
      name: absBlockName,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);
  // Leg Curl
  within(
    screen.getByRole("button", {
      name: legCurlBlockName,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);
  // Wendler Squat
  within(
    screen.getByRole("button", {
      name: /wendler back squat 5/i,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);

  // Finish all squat exercises
  const squats = baseSuperblock.blocks[0];
  expect(squats.name).toBe("Wendler Back Squat 5");
  let idx = 0;
  for (const exercise of squats.exercises) {
    await act(async () => {
      await waitFor(() =>
        within(
          screen.getByTestId(
            TestIds.Superblocks_SuperblockId_Perform__Block(squats.name),
          ),
        ).getByTestId(TestIds.Superblocks_SuperblockId_Perform__FinishExercise),
      ).then((a) => a.click());
    });

    // Wait for the row to be completed in the ui.
    await waitFor(() =>
      within(
        screen.getByTestId(
          TestIds.Superblocks_SuperblockId_Perform__Block(squats.name),
        ),
      ).getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(idx),
      ),
    );
    idx++;
  }
  // Squats block now completed
  within(
    screen.getByRole("button", {
      name: /wendler back squat 5/i,
    }),
  ).getByTestId(TestIds.CompletionStatusCompleted);
  // Abs
  within(
    screen.getByRole("button", {
      name: absBlockName,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);
  // Leg Curl
  within(
    screen.getByRole("button", {
      name: legCurlBlockName,
    }),
  ).getByTestId(TestIds.CompletionStatusNotStarted);

  // Click on the abs exercises accordion.
  await act(async () => {
    screen
      .getByRole("button", {
        name: absBlockName,
      })
      .click();
  });

  await waitFor(() => {
    // Check that the accordion is open by verifying aria-expanded is true on the block button
    expect(
      screen
        .getByRole("button", { name: absBlockName })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  // Finish all abs exercises
  const abs = baseSuperblock.blocks[1];
  expect(abs.name).toBe(absBlockName);
  idx = 0;
  for (const exercise of abs.exercises) {
    await act(async () => {
      await waitFor(() => {
        const button = within(
          screen.getByTestId(
            TestIds.Superblocks_SuperblockId_Perform__Block(abs.name),
          ),
        ).getByTestId(TestIds.Superblocks_SuperblockId_Perform__FinishExercise);
        expect(button).not.toBeDisabled();
        return button;
      }).then((a) => a.click());
    });

    // Wait for the row to be completed in the ui.
    await waitFor(() =>
      within(
        screen.getByTestId(
          TestIds.Superblocks_SuperblockId_Perform__Block(abs.name),
        ),
      ).getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(idx),
      ),
    );
    idx++;
  }
  // Abs Block now completed
  within(
    screen.getByRole("button", {
      name: absBlockName,
    }),
  ).getByTestId(TestIds.CompletionStatusCompleted);

  // Click on the leg curl exercises accordion.
  await act(async () => {
    screen
      .getByRole("button", {
        name: legCurlBlockName,
      })
      .click();
  });

  await waitFor(() => {
    // Check that the accordion is open by verifying aria-expanded is true on the block button
    expect(
      screen
        .getByRole("button", { name: legCurlBlockName })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  // Finish all leg curl exercises
  const legCurls = baseSuperblock.blocks[2];
  expect(legCurls.name).toBe(legCurlBlockName);
  idx = 0;
  for (const exercise of legCurls.exercises) {
    await act(async () => {
      await waitFor(() => {
        const button = within(
          screen.getByTestId(
            TestIds.Superblocks_SuperblockId_Perform__Block(legCurls.name),
          ),
        ).getByTestId(TestIds.Superblocks_SuperblockId_Perform__FinishExercise);
        expect(button).not.toBeDisabled();
        return button;
      }).then((a) => a.click());
    });

    // Wait for the row to be completed in the ui.
    await waitFor(() =>
      within(
        screen.getByTestId(
          TestIds.Superblocks_SuperblockId_Perform__Block(legCurls.name),
        ),
      ).getByTestId(
        TestIds.Superblocks_SuperblockId_Perform__CompletedExerciseRow(idx),
      ),
    );
    idx++;
  }
  // legCurl Block now completed
  within(
    screen.getByRole("button", {
      name: legCurlBlockName,
    }),
  ).getByTestId(TestIds.CompletionStatusCompleted);

  // Ensure overall block now completed
  within(
    screen.getByRole("heading", {
      name: /leg day/i,
    }),
  ).getByTestId(TestIds.CompletionStatusCompleted);
});

const addSuperblockAndBlock = async (blockName: string) => {
  const superblockId = randomUUID();
  await supabase.from("exercise_superblock").insert({
    user_id: userId,
    id: superblockId,
    completion_status: "not_started",
    name: "Test Superblock",
  });
  const { error } = await supabase.rpc("add_block_to_superblock", {
    p_equipment_type: "barbell",
    p_exercise_type: "barbell_back_squat",
    p_name: blockName,
    p_reps: 5,
    p_sets: 3,
    p_superblock_id: superblockId,
    p_user_id: userId,
    p_weight_unit: "pounds",
    p_weight_value: 225,
  });
  if (error) {
    fail(error.message);
  }
  return superblockId;
};

const addProgramAndBlocks = async (
  abBlockName: string,
  legCurlBlockName: string,
) => {
  const program_id = await serverUtil.supabaseRPC("add_wendler_program", {
    p_bench_press_increase: 225,
    p_bench_press_target_max: 225,
    p_deadlift_increase: 405,
    p_deadlift_target_max: 405,
    p_include_deload: true,
    p_overhead_press_increase: 135,
    p_overhead_press_target_max: 135,
    p_program_name: "Wendler Test Program",
    p_squat_increase: 315,
    p_squat_target_max: 315,
    p_user_id: userId,
    p_weight_unit: "pounds",
  });

  // Query the superblock id for the 5s cycle squat
  // First, get the 5s cycle for this program
  const { data: cycle, error: cycleError } = await supabase
    .from("wendler_program_cycle")
    .select("id")
    .eq("wendler_program_id", program_id)
    .eq("cycle_type", "5")
    .single();
  if (cycleError || !cycle) {
    fail(cycleError?.message || "No cycle found");
  }
  const cycleId = cycle.id;

  // Now, get the movement for barbell_back_squat in that cycle
  const { data: movement, error: movementError } = await supabase
    .from("wendler_program_cycle_movement")
    .select("block_id")
    .eq("wendler_program_cycle_id", cycleId)
    .eq("exercise_type", "barbell_back_squat")
    .single();
  if (movementError || !movement) {
    fail(movementError?.message || "No cycle movement found");
  }
  const blockId = movement.block_id;

  const { data: superblockLink, error: superblockLinkError } = await supabase
    .from("exercise_superblock_blocks")
    .select("superblock_id")
    .eq("block_id", blockId)
    .single();
  if (superblockLinkError || !superblockLink) {
    fail(superblockLinkError?.message || "No superblock link found");
  }
  const superblockId = superblockLink.superblock_id;

  const { error } = await supabase.rpc("add_block_to_superblock", {
    p_equipment_type: "machine",
    p_exercise_type: "machine_abdominal",
    p_name: abBlockName,
    p_reps: 10,
    p_sets: 5,
    p_superblock_id: superblockId,
    p_user_id: userId,
    p_weight_unit: "pounds",
    p_weight_value: 100,
  });
  if (error) {
    fail(error.message);
  }

  const { error: error2 } = await supabase.rpc("add_block_to_superblock", {
    p_equipment_type: "machine",
    p_exercise_type: "machine_seated_leg_curl",
    p_name: legCurlBlockName,
    p_reps: 10,
    p_sets: 5,
    p_superblock_id: superblockId,
    p_user_id: userId,
    p_weight_unit: "pounds",
    p_weight_value: 135,
  });

  if (error2) {
    fail(error2.message);
  }

  return superblockId;
};
