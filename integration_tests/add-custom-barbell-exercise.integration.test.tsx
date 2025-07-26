import EquipmentExercisePage, {
  EquipmentExercisePageProps,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/page";
import { FIRST_PAGE_NUM, pathForBarbellExercisePage } from "@/constants";
import * as serverUtil from "@/serverUtil";
import { TestIds } from "@/test-ids";
import { USER_ID } from "@/test/constants";
import { getSession, requireLoggedInUser } from "@/test/serverUtil";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach } from "node:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

const supabase = serverUtil.getSupabaseClient();

const deleteRelevantRowsForUser = async (userId: string) => {
  await supabase.from("exercises").delete().eq("user_id", userId);
  await supabase.from("form_drafts").delete().eq("user_id", userId);
};

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    requireLoggedInUser(
      USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
    ),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(
    getSession(USER_ID["add-custom-barbell-exercise.integration.test.tsx"]),
  );
  await deleteRelevantRowsForUser(
    USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
  );
});

afterEach(async () => {
  await deleteRelevantRowsForUser(
    USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
  );
});

describe("User Journey: Add Custom Barbell Exercises", () => {
  it("should allow a logged in user to add a custom deadlift barbell exercise", async () => {
    // Initial render of the page.
    let page = await EquipmentExercisePage(pageProps);
    await act(async () => render(page));

    // Find and click the "Add Exercise" button. This will add a db form draft.
    await act(async () => {
      // Assert that there are no barbell deadlifts for this user.
      const { data: initialDeadlifts } = await supabase
        .from("exercises")
        .select("*")
        .eq(
          "user_id",
          USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
        )
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
          .eq(
            "user_id",
            USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
          );
        expect(drafts?.length).toBeGreaterThan(0);
      });
      page = await EquipmentExercisePage(pageProps);
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
          .eq(
            "user_id",
            USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
          )
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

describe("User Journey: Can use components to edit from the default values", () => {
  it("should allow a logged in user to modify every field in the UI", async () => {
    // Initial render of the page.
    let page = await EquipmentExercisePage(pageProps);
    await act(async () => render(page));

    // Find and click the "Add Exercise" button. This will add a db form draft.
    await act(async () => {
      const { data: initialDeadlifts } = await supabase
        .from("exercises")
        .select("*")
        .eq(
          "user_id",
          USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
        )
        .eq("exercise_type", "barbell_deadlift");
      expect(initialDeadlifts?.length).toBe(0);
      const addExerciseButton = await waitFor(() =>
        screen.getByTestId(TestIds.AddExerciseButton),
      );
      addExerciseButton.click();

      // Wait for a form draft to exist before re-rendering.
      await waitFor(async () => {
        const { data: drafts } = await supabase
          .from("form_drafts")
          .select("*")
          .eq(
            "user_id",
            USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
          );
        expect(drafts?.length).toBeGreaterThan(0);
      });
      page = await EquipmentExercisePage(pageProps);
      await act(async () => render(page));
    });

    // Find the select reps component and click the AMRAP toggle
    await act(async () => {
      (
        await Promise.all([
          waitFor(() => screen.getByTestId(TestIds.SelectRepsAMRAPToggle)),
          waitFor(() => screen.getByTestId(TestIds.SelectRepsAdd)),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(45))),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(25))),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(10))),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(5))),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(2.5))),
          waitFor(() => screen.getByTestId(TestIds.PerceivedEffort("hard"))),
          waitFor(() => screen.getByTestId(TestIds.WarmupToggle)),
        ])
      ).map((e) => e.click());
      const notes = await waitFor(() => screen.getByTestId(TestIds.NotesInput));
      fireEvent.change(notes, { target: { value: "Test note" } });
    });

    await act(async () => {
      const addBarbellLiftButton = await waitFor(() =>
        screen.getByTestId(TestIds.AddBarbellLiftButton),
      );
      addBarbellLiftButton.click();

      // Wait for the new lift to exist in the DB before re-rendering.
      await waitFor(async () => {
        const { data: actualExercises } = await supabase
          .from("exercises")
          .select("*")
          .eq(
            "user_id",
            USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
          )
          .eq("exercise_type", "barbell_deadlift");
        expect(actualExercises?.length).toBe(1);
        const actualExercise = actualExercises![0];
        const {
          reps: actualReps,
          is_amrap: actualIsAmrap,
          actual_weight_value: actualActualWeightValue,
          target_weight_value: actualTargetWeightValue,
          perceived_effort: actualPerceivedEffort,
          warmup: actualIsWarmup,
          notes: actualNotes,
        } = actualExercise;
        expect(actualReps).toBe(6);
        expect(actualIsAmrap).toBe(true);
        expect(actualActualWeightValue).toBe(220);
        expect(actualTargetWeightValue).toBe(220);
        expect(actualPerceivedEffort).toBe("hard");
        expect(actualIsWarmup).toBe(true);
        expect(actualNotes).toBe("Test note");
      });
    });
  });
});

// Page props do not differ for any of the integration tests.
const pageProps: EquipmentExercisePageProps = {
  userId: USER_ID["add-custom-barbell-exercise.integration.test.tsx"],
  equipmentType: "barbell",
  exerciseType: "barbell_deadlift",
  path: pathForBarbellExercisePage("barbell_deadlift"),
  pageNumber: FIRST_PAGE_NUM,
};
