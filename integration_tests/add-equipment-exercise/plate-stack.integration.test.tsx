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
const userId =
  USER_ID["add-equipment-exercise/plate-stack.integration.test.tsx"];

const equipmentType = "plate_stack";
const exerciseType = "plate_stack_calf_raise";
const pageProps: EquipmentExercisePageProps = {
  userId: userId,
  equipmentType: equipmentType,
  exerciseType: exerciseType,
  path: pathForEquipmentExercisePage(equipmentType, exerciseType),
  pageNumber: FIRST_PAGE_NUM,
};

const deleteRelevantRowsForUser = async (userId: string) => {
  await supabase.from("exercises").delete().eq("user_id", userId);
  await supabase.from("form_drafts").delete().eq("user_id", userId);
};

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    requireLoggedInUser(userId),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(getSession(userId));

  await deleteRelevantRowsForUser(userId);

  const { data } = await supabase
    .from("exercises")
    .select("*")
    .eq("user_id", userId)
    .eq("exercise_type", "plate_stack_calf_raise");
  expect(data?.length).toBe(0);

  const { data: drafts } = await supabase
    .from("form_drafts")
    .select("*")
    .eq("user_id", userId);
  expect(drafts?.length).toBe(0);
});

afterEach(async () => {
  await deleteRelevantRowsForUser(userId);
});

describe("User Journey: Add Plate Stack Exercise", () => {
  it("should allow a logged in user to add a plate stack exercise", async () => {
    let page = await EquipmentExercisePage(pageProps);
    await act(async () => render(page));

    await act(async () => {
      await waitFor(() => screen.getByTestId(TestIds.AddExerciseButton)).then(
        (a) => a.click(),
      );

      // Wait for the form draft to exist in the DB before re-rendering.
      await waitFor(async () => {
        const { data: drafts } = await supabase
          .from("form_drafts")
          .select("*")
          .eq("user_id", userId);
        expect(drafts?.length).toBeGreaterThan(0);
      });
      page = await EquipmentExercisePage(pageProps);
      await act(async () => render(page));
    });

    await act(async () => {
      await waitFor(() =>
        screen.getByTestId(TestIds.AddEquipmentExerciseButton),
      ).then((a) => a.click());

      await waitFor(async () => {
        const { data: actualExercises } = await supabase
          .from("exercises")
          .select("*")
          .eq("user_id", userId)
          .eq("exercise_type", exerciseType);
        expect(actualExercises?.length).toBe(1);

        const actualExercise = actualExercises![0];
        const {
          actual_weight_value: actualActualWeightValue,
          completion_status: actualCompletionStatus,
        } = actualExercise;
        expect(actualActualWeightValue).toBe(0);
        expect(actualCompletionStatus).toBe("completed");
      });
    });
  });
});

describe("User Journey: Can use components to edit from the default values", () => {
  it("should allow a logged in user to modify every field in the UI", async () => {
    let page = await EquipmentExercisePage(pageProps);
    await act(async () => render(page));

    await act(async () => {
      await waitFor(() => screen.getByTestId(TestIds.AddExerciseButton)).then(
        (a) => a.click(),
      );

      await waitFor(async () => {
        const { data: drafts } = await supabase
          .from("form_drafts")
          .select("*")
          .eq("user_id", userId);
        expect(drafts?.length).toBeGreaterThan(0);
      });
      page = await EquipmentExercisePage(pageProps);
      await act(async () => render(page));
    });

    await act(async () => {
      (
        await Promise.all([
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(45))),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(25))),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(10))),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(5))),
          waitFor(() => screen.getByTestId(TestIds.ActivePlate(2.5))),
          waitFor(() => screen.getByTestId(TestIds.SelectRepsAMRAPToggle)),
          waitFor(() => screen.getByTestId(TestIds.RepsUpButton)),
          waitFor(() => screen.getByTestId(TestIds.PerceivedEffort("hard"))),
          waitFor(() => screen.getByTestId(TestIds.IsWarmupToggle)),
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
          .eq("user_id", userId)
          .eq("exercise_type", exerciseType);
        expect(actualExercises?.length).toBe(1);
        const actualExercise = actualExercises![0];
        const {
          reps: actualReps,
          is_amrap: actualIsAMRAP,
          actual_weight_value: actualActualWeightValue,
          target_weight_value: actualTargetWeightValue,
          perceived_effort: actualPerceivedEffort,
          is_warmup: actualIsWarmup,
          notes: actualNotes,
        } = actualExercise;
        expect(actualReps).toBe(11);
        expect(actualIsAMRAP).toBe(true);
        expect(actualActualWeightValue).toBe(45 + 25 + 10 + 5 + 2.5);
        expect(actualTargetWeightValue).toBe(45 + 25 + 10 + 5 + 2.5);
        expect(actualPerceivedEffort).toBe("hard");
        expect(actualIsWarmup).toBe(true);
        expect(actualNotes).toBe("Test note");
      });
    });
  });
});
