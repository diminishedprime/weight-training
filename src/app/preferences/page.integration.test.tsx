import { vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from "react";
import PreferencesPage from "@/app/preferences/page";
import { describe, it, expect, beforeEach } from "vitest";
import { USER_ID_WITH_PREFERENCES, USER_ID_LOGGED_OUT } from "@/test/constants";
import * as fakeServerUtil from "@/test/serverUtil";
import * as serverUtil from "@/serverUtil";
import { getExercisePreferenceTestIds } from "./_components/SetExerciseWeights/SetExercisePreferences";

describe("PreferencesPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders successfully with preferences data", async () => {
    const getFakeSupabaseClient = fakeServerUtil.getSupabaseClient(
      USER_ID_WITH_PREFERENCES
    );
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_WITH_PREFERENCES)
    );
    vi.spyOn(serverUtil, "getSupabaseClient").mockImplementation(
      getFakeSupabaseClient
    );
    render(await PreferencesPage());
    await waitFor(() => {
      expect(
        screen.getAllByText(/Preferred Weight Unit/i).length
      ).toBeGreaterThan(0);
    });
  });

  it("redirects to login with correct url if user is not logged in", async () => {
    const getFakeSupabaseClient =
      fakeServerUtil.getSupabaseClient(USER_ID_LOGGED_OUT);
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_OUT)
    );
    vi.spyOn(serverUtil, "getSupabaseClient").mockImplementation(
      getFakeSupabaseClient
    );
    let error: Error | null = null;
    try {
      await PreferencesPage();
    } catch (e) {
      error = e as Error;
    }
    expect(error).not.toBeNull();
    expect(error?.message).toContain(
      "redirect:/login?redirect-uri=%2Fpreferences"
    );
  });

  it("can modify a back_squat one rep max", async () => {
    const getFakeSupabaseClient = fakeServerUtil.getSupabaseClient(
      USER_ID_WITH_PREFERENCES
    );
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_WITH_PREFERENCES)
    );
    vi.spyOn(serverUtil, "getSupabaseClient").mockImplementation(
      getFakeSupabaseClient
    );
    render(await PreferencesPage());
    await waitFor(() => {
      expect(screen.getByText(/Back Squat/i)).toBeInTheDocument();
    });
    // Use testid for 1 Rep Max input and Save button
    const oneRepMaxInput = screen.getByTestId(
      "one-rep-max-input-barbell_back_squat"
    ) as HTMLInputElement;
    expect(oneRepMaxInput).toBeTruthy();
    await act(async () => {
      fireEvent.change(oneRepMaxInput, { target: { value: "315" } });
    });
    const saveButton = screen.getByTestId(
      "save-one-rep-max-barbell_back_squat"
    );
    expect(saveButton).toBeTruthy();
    await act(async () => {
      saveButton.click();
    });
    // Wait for the UI to update (success message, spinner, etc.)
    await waitFor(() => {
      // The input should be disabled or the UI should reflect the update
      // (You can assert on a success message, or that the input is disabled, etc.)
      // For now, just check the input value is still 315
      expect(oneRepMaxInput!.value).toBe("315");
    });
    // Optionally, you can check that the fake supabaseClient was called with the expected RPC
    expect(getFakeSupabaseClient().rpc).toHaveBeenCalledWith(
      "update_user_one_rep_max",
      expect.objectContaining({
        p_user_id: USER_ID_WITH_PREFERENCES,
        p_exercise_type: "barbell_back_squat",
        p_weight_value: 315,
        // ...other params
      })
    );
  });

  it("can modify a back_squat target max", async () => {
    const getFakeSupabaseClient = fakeServerUtil.getSupabaseClient(
      USER_ID_WITH_PREFERENCES
    );
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_WITH_PREFERENCES)
    );
    vi.spyOn(serverUtil, "getSupabaseClient").mockImplementation(
      getFakeSupabaseClient
    );
    render(await PreferencesPage());
    await waitFor(() => {
      expect(screen.getByText(/Back Squat/i)).toBeInTheDocument();
    });
    // Use testid for Target Max input and Save button
    const targetMaxInput = screen.getByTestId(
      "target-max-input-barbell_back_squat"
    ) as HTMLInputElement;
    expect(targetMaxInput).toBeTruthy();
    await act(async () => {
      fireEvent.change(targetMaxInput, { target: { value: "285" } });
    });
    // The second save button in the form is for Target Max
    const targetMaxSaveButton = screen.getByTestId(
      "save-target-max-barbell_back_squat"
    );
    expect(targetMaxSaveButton).toBeTruthy();
    await act(async () => {
      targetMaxSaveButton.click();
    });
    await waitFor(() => {
      expect(targetMaxInput!.value).toBe("285");
    });
    expect(getFakeSupabaseClient().rpc).toHaveBeenCalledWith(
      "update_user_target_max",
      expect.objectContaining({
        p_user_id: USER_ID_WITH_PREFERENCES,
        p_exercise_type: "barbell_back_squat",
        p_weight_value: 285,
        // ...other params
      })
    );
  });

  it("shows 'Set to 90%' button for deadlift if 1 rep max exists and clicking it sets target max input", async () => {
    const getFakeSupabaseClient = fakeServerUtil.getSupabaseClient(
      USER_ID_WITH_PREFERENCES
    );
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_WITH_PREFERENCES)
    );
    vi.spyOn(serverUtil, "getSupabaseClient").mockImplementation(
      getFakeSupabaseClient
    );
    render(await PreferencesPage());
    await waitFor(() => {
      expect(screen.getByText(/Deadlift/i)).toBeInTheDocument();
    });
    const testIds = getExercisePreferenceTestIds("barbell_deadlift");
    // The 1 rep max for deadlift should exist in the fake data
    // The 'Set to 90%' button should be visible
    const setTo90Button = screen.getByTestId(testIds.setTo90);
    expect(setTo90Button).toBeTruthy();
    // The target max input should exist
    const targetMaxInput = screen.getByTestId(
      testIds.targetMaxInput
    ) as HTMLInputElement;
    expect(targetMaxInput).toBeTruthy();
    // Click the button and check the input value is set to 90% of 1RM (rounded)
    await act(async () => {
      setTo90Button.click();
    });
    // Assuming the fake 1RM for deadlift is 400, so 90% is 360
    await waitFor(() => {
      expect(targetMaxInput.value).toBe("360");
    });
  });

  // TODO instead of having a global preferred weight unit, we should set it per exercise. Same thing for default rest time.
  // For both of these, though, we should have the db actually insert the rows for every exercise I think. Maybe with a trigger?
});
