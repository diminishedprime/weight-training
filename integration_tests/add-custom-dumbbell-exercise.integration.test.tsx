import DumbbellExercisePage, {
  DumbbellExercisePageProps,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/page_dumbbell";
import { FIRST_PAGE_NUM, pathForEquipmentExercisePage } from "@/constants";
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

describe("User Journey: Add Custom Dumbbell Exercises", () => {
  it("should allow a logged in user to add a custom curl dumbbell exercise", async () => {
    const pageProps: DumbbellExercisePageProps = {
      userId: USER_ID_LOGGED_IN,
      equipmentType: "dumbbell",
      exerciseType: "dumbbell_bicep_curl",
      path: pathForEquipmentExercisePage("dumbbell", "dumbbell_bicep_curl"),
      pageNumber: FIRST_PAGE_NUM,
    };

    // Initial render of the page.
    let page = await DumbbellExercisePage(pageProps);
    await act(async () => render(page));

    // Find and click the "Add Exercise" button. This will add a db form draft.
    await act(async () => {
      // Assert that there are no dumbbell curls for this user.
      const { data: initialCurls } = await supabase
        .from("exercises")
        .select("*")
        .eq("user_id", USER_ID_LOGGED_IN)
        .eq("exercise_type", "dumbbell_bicep_curl");
      expect(initialCurls?.length).toBe(0);
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
      page = await DumbbellExercisePage(pageProps);
      await act(async () => render(page));
    });

    await act(async () => {
      const addDumbbellLiftButton = await waitFor(() =>
        screen.getByTestId(TestIds.AddDumbbellLiftButton),
      );
      addDumbbellLiftButton.click();

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
          .eq("exercise_type", "dumbbell_bicep_curl");
        expect(lifts?.length).toBe(1);
        expect(lifts![0].completion_status).toBe("completed");
        expect(lifts![0].reps).toBe(10);
        expect(lifts![0].actual_weight_value).toBe(10);
      });
    });
    // TODO: I'd like to assert something about the visual state of the page,
    // but I can't get _anything_ to work, try this again sometime.
  });
});
