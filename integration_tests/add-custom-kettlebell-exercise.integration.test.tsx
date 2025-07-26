import EquipmentExercisePage, {
  EquipmentExercisePageProps,
} from "@/app/exercise/[equipment_type]/[exercise_type]/_components/page";
import { FIRST_PAGE_NUM, pathForEquipmentExercisePage } from "@/constants";
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
      USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
    ),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(
    getSession(USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"]),
  );
  await deleteRelevantRowsForUser(
    USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
  );
});

afterEach(async () => {
  await deleteRelevantRowsForUser(
    USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
  );
});

describe("User Journey: Add Custom Kettlebell Exercises", () => {
  it("should allow a logged in user to add a custom kettlebell swing exercise", async () => {
    // Initial render of the page.
    let page = await EquipmentExercisePage(pageProps);
    await act(async () => render(page));

    // Find and click the "Add Exercise" button. This will add a db form draft.
    await act(async () => {
      // Assert that there are no kettlebell swings for this user.
      const { data } = await supabase
        .from("exercises")
        .select("*")
        .eq(
          "user_id",
          USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
        )
        .eq("exercise_type", "kettlebell_front_squat");
      expect(data?.length).toBe(0);
      const addExerciseButton = await waitFor(() =>
        screen.getByTestId(TestIds.AddExerciseButton),
      );
      addExerciseButton.click();

      // Wait for the form draft to exist in the DB before re-rendering.
      await waitFor(async () => {
        const { data: drafts } = await supabase
          .from("form_drafts")
          .select("*")
          .eq(
            "user_id",
            USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
          );
        expect(drafts?.length).toBeGreaterThan(0);
      });
      page = await EquipmentExercisePage(pageProps);
      await act(async () => render(page));
    });

    await act(async () => {
      const addExerciseButton = await waitFor(() =>
        screen.getByTestId(TestIds.AddEquipmentExerciseButton),
      );
      addExerciseButton.click();

      // Wait for the new lift to exist in the DB before re-rendering.
      await waitFor(async () => {
        const { data: actualExercises } = await supabase
          .from("exercises")
          .select("*")
          .eq(
            "user_id",
            USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
          )
          .eq("exercise_type", "kettlebell_front_squat");
        expect(actualExercises?.length).toBe(1);
        const actualExercise = actualExercises![0];
        const {
          actual_weight_value: actualActualWeightValue,
          completion_status: actualCompletionStatus,
        } = actualExercise;
        expect(actualActualWeightValue).toBe(18);
        expect(actualCompletionStatus).toBe("completed");
      });
    });
  });
});

describe("User Journey: Can use components to edit from the default values", () => {
  it("should allow a logged in user to modify every field in the UI", async () => {
    // Initial render of the page.
    let page = await EquipmentExercisePage(pageProps);
    await act(async () => render(page));

    // Find and click the "Add Exercise" button. This will add a db form draft.
    await act(async () => {
      const { data } = await supabase
        .from("exercises")
        .select("*")
        .eq(
          "user_id",
          USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
        )
        .eq("exercise_type", "kettlebell_front_squat");
      expect(data?.length).toBe(0);
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
            USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
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
          waitFor(() => screen.getByTestId(TestIds.RepsDownButton)),
          waitFor(() => screen.getByTestId(TestIds.KettlebellPlus)),
          waitFor(() => screen.getByTestId(TestIds.PerceivedEffort("easy"))),
          waitFor(() => screen.getByTestId(TestIds.WarmupToggle)),
        ])
      ).map((e) => e.click());
      const notes = await waitFor(() => screen.getByTestId(TestIds.NotesInput));
      fireEvent.change(notes, { target: { value: "Test note" } });
    });

    await act(async () => {
      const addExerciseButton = await waitFor(() =>
        screen.getByTestId(TestIds.AddEquipmentExerciseButton),
      );
      addExerciseButton.click();

      // Wait for the new lift to exist in the DB before re-rendering.
      await waitFor(async () => {
        const { data: actualExercises } = await supabase
          .from("exercises")
          .select("*")
          .eq(
            "user_id",
            USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
          )
          .eq("exercise_type", "kettlebell_front_squat");
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
        expect(actualReps).toBe(9);
        expect(actualIsAmrap).toBe(true);
        expect(actualActualWeightValue).toBe(26);
        expect(actualTargetWeightValue).toBe(26);
        expect(actualPerceivedEffort).toBe("easy");
        expect(actualIsWarmup).toBe(true);
        expect(actualNotes).toBe("Test note");
      });
    });
  });
});

// Page props do not differ for any of the integration tests.
const pageProps: EquipmentExercisePageProps = {
  userId: USER_ID["add-custom-kettlebell-exercise.integration.test.tsx"],
  equipmentType: "kettlebell",
  exerciseType: "kettlebell_front_squat",
  path: pathForEquipmentExercisePage("kettlebell", "kettlebell_front_squat"),
  pageNumber: FIRST_PAGE_NUM,
};
