import { getExercisesByEquipment } from "@/util";
import { describe, it, vi, beforeEach, expect } from "vitest";
import * as serverUtil from "@/serverUtil";
import { requireLoggedInUser, getSession } from "@/test/serverUtil";
import { USER_ID_LOGGED_IN } from "@/test/constants";
import { render, screen, waitFor, act } from "@testing-library/react";
import { ExerciseTypePage } from "@/app/exercise/[exercise_type]/_page";
import { TestIds } from "@/test-ids";

// Utility to delete all exercises for the logged-in user before each test
const supabase = serverUtil.getSupabaseClient();

const deleteAllExercisesForUser = async (userId: string) => {
  // Adjust table name and user id column as needed
  await supabase.from("exercises").delete().eq("user_id", userId);
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
  await deleteAllExercisesForUser(USER_ID_LOGGED_IN);
});

// TODO to make my life easier I should have one of these add barbell exercises
// tests be static so I can comment out the others when stuff goes wrong.

// TODO these tests are broken right now because I changed how the add exercise
// form is rendered. It's now conditional by the presence of some formDraft data
// in the database so I may need to handle some of that to make sure it works in
// the tests.

describe("User Journey: Add Custom Barbell Exercises", () => {
  exercisesByEquipment["barbell"].forEach((exerciseType) => {
    it(`should allow a logged in user to add a custom barbell exercise: ${exerciseType}`, async () => {
      // Render the exercise page for this barbell exercise type as a server component
      let page = await ExerciseTypePage({
        exerciseType,
        currentPath: `/exercise/${exerciseType}`,
      });
      await act(async () => {
        render(page);
      });

      // Click the "Add Exercise" button to open the form
      await act(async () => {
        (
          await waitFor(() => screen.getByTestId(TestIds.AddExerciseButton))
        ).click();
      });

      // Assert that there are no exercises for this user and type before adding
      const { data: exercisesBefore, error: errorBefore } = await supabase
        .from("exercises")
        .select("*")
        .eq("user_id", USER_ID_LOGGED_IN);
      expect(errorBefore).toBeNull();
      expect(exercisesBefore).toBeDefined();
      expect(Array.isArray(exercisesBefore)).toBe(true);
      expect((exercisesBefore ?? []).length).toBe(0);

      // Make no changes and click the "Add Lift" button
      await act(async () => {
        (
          await waitFor(() => screen.getByTestId(TestIds.AddBarbellLiftButton))
        ).click();
      });

      // Wait some time to allow server action/DB write to complete
      // TODO - I wish there was a better way to wait for the server action to
      // complete, but as of now, this is the best I got.
      // TODO - this my be flakey, if it is I can set to a larger number than
      // 25.
      await new Promise((resolve) => setTimeout(resolve, 25));

      page = await ExerciseTypePage({
        exerciseType,
        currentPath: `/exercise/${exerciseType}`,
      });
      await act(async () => {
        render(page);
      });

      // Assert that 5x45 is in the DOM after the re-render
      expect(screen.getByText(/5x45/i)).toBeInTheDocument();
    });
  });
});
