// TODO: (easy) Update these file names to have some folder structure so it's
// easier to navigate around. something like:
//
// integration_tests
// |- dumbbell
//    |- edit-exercise.integration.test.tsx
// etc.
//
// Or maybe we should just put some integration tests together?
//
// integration_tests
// |- edit-equipment-exercise.integration.test.tsx
//
// And then this file has a different describe block for each? idk, that'd be
// slower since tests in the same file can't run in parallel.

import EditEquipmentExercisePage, {
  EditEquipmentExercisePageProps,
} from "@/app/exercise/[equipment_type]/[exercise_type]/edit/[exercise_id]/_components/EditEquipmentExercisePage";
import { EquipmentType, ExerciseType } from "@/common-types";
import {
  pathForEquipmentExerciseEdit,
  pathForEquipmentExercisePage,
} from "@/constants";
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
};

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    requireLoggedInUser(USER_ID["edit-dumbbell-exercise.integration.test.tsx"]),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(
    getSession(USER_ID["edit-dumbbell-exercise.integration.test.tsx"]),
  );
  await deleteRelevantRowsForUser(
    USER_ID["edit-dumbbell-exercise.integration.test.tsx"],
  );
});

afterEach(async () => {
  await deleteRelevantRowsForUser(
    USER_ID["edit-dumbbell-exercise.integration.test.tsx"],
  );
});

describe("User Journey: Edit Dumbbell Exercises", () => {
  it("should allow a logged in user to add a custom curl dumbbell exercise", async () => {
    const insertTime = new Date().toISOString();
    const equipmentType = "dumbbell" as EquipmentType;
    const exerciseType = "dumbbell_bicep_curl" as ExerciseType;
    const exerciseId = await serverUtil.supabaseRPC("create_exercise", {
      p_user_id: USER_ID["edit-dumbbell-exercise.integration.test.tsx"],
      p_exercise_type: exerciseType,
      p_equipment_type: equipmentType,
      // These are values from the default preferences.
      p_target_weight_value: 30,
      p_actual_weight_value: 30,
      p_reps: 8,
      p_performed_at: insertTime,
    });

    const pageProps: EditEquipmentExercisePageProps = {
      equipmentType: equipmentType,
      exerciseType: exerciseType,
      userId: USER_ID["edit-dumbbell-exercise.integration.test.tsx"],
      exerciseId: exerciseId,
      currentPath: pathForEquipmentExerciseEdit(
        equipmentType,
        exerciseType,
        exerciseId,
      ),
      backTo: pathForEquipmentExercisePage(equipmentType, exerciseType),
    };

    // Initial render of the page.
    await act(async () => render(await EditEquipmentExercisePage(pageProps)));

    // Verify the inistial state of the page.
    await act(async () => {
      const cancel = await waitFor(() =>
        screen.getByTestId(TestIds.EditEquipmentCancelButton),
      );
      const link = new URL((cancel as HTMLAnchorElement).href);
      expect(link.pathname).toBe(
        pathForEquipmentExercisePage(equipmentType, exerciseType),
      );

      const reset = await waitFor(() =>
        screen.getByTestId(TestIds.EditEquipmentResetButton),
      );
      // Reset should be disabled because there shouldn't be any changes, yet.
      expect(reset).toBeDisabled();

      const save = await waitFor(() =>
        screen.getByTestId(TestIds.EditEquipmentSaveButton),
      );
      // Save should be disabled because there shouldn't be any changes, yet.
      expect(save).toBeDisabled();
    });

    // Update everything visible on the form.
    await act(async () => {
      const elements = await Promise.all([
        waitFor(() => screen.getByTestId(TestIds.EditDumbbellBumpDownButton)),
        waitFor(() => screen.getByTestId(TestIds.PerceivedEffort("okay"))),
        waitFor(() => screen.getByTestId(TestIds.RepsDownButton)),
        waitFor(() => screen.getByTestId(TestIds.SelectRepsAMRAPToggle)),
        waitFor(() => screen.getByTestId(TestIds.CompletionStatus("failed"))),
        waitFor(() => screen.getByTestId(TestIds.WarmupToggle)),
      ]);
      elements.map((e) => e.click());

      const notes = await waitFor(() => screen.getByTestId(TestIds.NotesInput));
      fireEvent.change(notes, {
        target: { value: "here are some excellent notes." },
      });

      const save = await waitFor(() =>
        screen.getByTestId(TestIds.EditEquipmentSaveButton),
      );
      // Save the exercise.
      save.click();
    });

    // Wait for the exercise to be actually saved (i.e. it's update_time is no
    // longer the same as insert_time)
    await act(async () => {
      await waitFor(async () => {
        const { data } = await supabase
          .from("exercises")
          .select("*")
          .eq("id", exerciseId)
          .limit(1)
          .single();
        expect(data?.update_time).not.toBe(insertTime);
      });
    });

    // Now that we can be sure the edit went through, verify all of the other fields at once.
    await act(async () => {
      const actual = await serverUtil.supabaseRPC("get_exercise_for_user", {
        p_user_id: USER_ID["edit-dumbbell-exercise.integration.test.tsx"],
        p_exercise_id: exerciseId,
      });
      const {
        actual_weight_value: actualActualWeightValue,
        reps: actualReps,
        is_amrap: actualIsAmrap,
        notes: actualNotes,
        completion_status: actualCompletionStatus,
        perceived_effort: actualPerceivedEffort,
        target_weight_value: actualTargetWeightValue,
        warmup: actualWarmup,
      } = actual;
      expect(actualActualWeightValue).toBe(20);
      expect(actualTargetWeightValue).toBe(20);
      expect(actualReps).toBe(7);
      expect(actualIsAmrap).toBe(true);
      expect(actualNotes).toBe("here are some excellent notes.");
      expect(actualCompletionStatus).toBe("failed");
      expect(actualPerceivedEffort).toBe("okay");
      expect(actualWarmup).toBe(true);
    });
  });
});
