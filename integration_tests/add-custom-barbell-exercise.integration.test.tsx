import BarbellExercisePage, {
  BarbellExercisePageProps,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/page_barbell";
import { FIRST_PAGE_NUM, pathForBarbellExercisePage } from "@/constants";
import * as serverUtil from "@/serverUtil";
import { TestIds } from "@/test-ids";
import { USER_ID_LOGGED_IN } from "@/test/constants";
import { getSession, requireLoggedInUser } from "@/test/serverUtil";
import { getExercisesByEquipment } from "@/util";
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach } from "node:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

const supabase = serverUtil.getSupabaseClient();

const deleteRelevantRowsForUser = async (userId: string) => {
  await supabase.from("exercises").delete().eq("user_id", userId);
  await supabase.from("form_drafts").delete().eq("user_id", userId);
};

const exercisesByEquipment = getExercisesByEquipment();

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    requireLoggedInUser(USER_ID_LOGGED_IN),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(
    getSession(USER_ID_LOGGED_IN),
  );
  await deleteRelevantRowsForUser(USER_ID_LOGGED_IN);
});

afterEach(async () => {
  await deleteRelevantRowsForUser(USER_ID_LOGGED_IN);
});

// TODO: Consider a test for the "real" page that does fancy narrowing, etc.

describe("User Journey: Add Custom Barbell Exercises", () => {
  it("should allow a logged in user to add a custom deadlift barbell exercise", async () => {
    const pageProps: BarbellExercisePageProps = {
      userId: USER_ID_LOGGED_IN,
      equipmentType: "barbell",
      exerciseType: "barbell_deadlift",
      path: pathForBarbellExercisePage("barbell_deadlift"),
      pageNumber: FIRST_PAGE_NUM,
    };

    // Initial render of the page.
    let page = await BarbellExercisePage(pageProps);
    await act(async () => render(page));

    // Find and click the "Add Exercise" button. This will add a db form draft.
    await act(async () => {
      // Assert that there are no barbell deadlifts for this user.
      const { data: initialDeadlifts } = await supabase
        .from("exercises")
        .select("*")
        .eq("user_id", USER_ID_LOGGED_IN)
        .eq("exercise_type", "barbell_deadlift");
      expect(initialDeadlifts?.length).toBe(0);
      const addExerciseButton = await waitFor(() =>
        screen.getByTestId(TestIds.AddExerciseButton),
      );
      addExerciseButton.click();

      // Wait for the form draft to exist in the DB before re-rendering. This is
      // necessary because normally this would be handled by the UI since it would
      // do a revalidate which would cause a refresh after the server action is
      // done, but we can't "await" for that to happen since it's async and out of
      // our control.
      await waitFor(async () => {
        const { data: drafts } = await supabase
          .from("form_drafts")
          .select("*")
          .eq("user_id", USER_ID_LOGGED_IN);
        expect(drafts?.length).toBeGreaterThan(0);
      });
      page = await BarbellExercisePage(pageProps);
      await act(async () => render(page));
    });

    await act(async () => {
      const addBarbellLiftButton = await waitFor(() =>
        screen.getByTestId(TestIds.AddBarbellLiftButton),
      );
      addBarbellLiftButton.click();

      // Wait for the new lift to exist in the DB before re-rendering. This is
      // necessary because normally this would be handled by the UI since it would
      // do a revalidate which would cause a refresh after the server action is
      // done, but we can't "await" for that to happen since it's async and out of
      // our control.
      await waitFor(async () => {
        const { data: lifts } = await supabase
          .from("exercises")
          .select("*")
          .eq("user_id", USER_ID_LOGGED_IN)
          .eq("exercise_type", "barbell_deadlift");
        expect(lifts?.length).toBe(1);
        expect(lifts![0].completion_status).toBe("completed");
        expect(lifts![0].reps).toBe(5);
        expect(lifts![0].actual_weight_value).toBe(45);
      });
    });
    // TODO: I'd like to assert something about the visual state of the page,
    // but I can't get _anything_ to work, try this again sometime.
  });
});
