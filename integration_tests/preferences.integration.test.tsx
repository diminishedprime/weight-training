import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { requireLoggedInUser, getSession } from "@/test/serverUtil";
import { USER_ID_PREFERENCES } from "@/test/constants";
import { render, screen, waitFor, act } from "@testing-library/react";
import { TestIds } from "@/test-ids";
import PreferencesPage from "@/app/preferences/_page";
import { supabaseRPC } from "@/serverUtil";
import { DEFAULT_VALUES } from "@/constants";
import * as serverUtil from "@/serverUtil";

const supabase = serverUtil.getSupabaseClient();

const deleteRelevantRowsForUser = async (userId: string) => {
  await supabase.from("user_preferences").delete().eq("user_id", userId);
};

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    requireLoggedInUser(USER_ID_PREFERENCES),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(
    getSession(USER_ID_PREFERENCES),
  );
  await deleteRelevantRowsForUser(USER_ID_PREFERENCES);
});

afterEach(async () => {
  await deleteRelevantRowsForUser(USER_ID_PREFERENCES);
});

describe("User Journey: Update Preferences", () => {
  it("should allow a logged in user to update and persist their preferences", async () => {
    // Initial render of the page.
    let page = await PreferencesPage();
    await act(async () => render(page));

    // Assert that there are no preferences for this user.
    const { data: initialPrefs } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", USER_ID_PREFERENCES);
    expect(initialPrefs?.length).toBe(0);

    // Find and click the "Save Preferences" button.
    await act(async () => {
      const saveButton = await waitFor(() =>
        screen.getByTestId(TestIds.Preferences_SavePreferencesButton),
      );
      saveButton.click();

      // Wait for the preferences to be saved in the DB
      await waitFor(async () => {
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", USER_ID_PREFERENCES);
        expect(prefs?.length).toBeGreaterThan(0);
      });
    });

    // Assert the default settings were saved correctly.
    await waitFor(async () => {
      const preferences = await supabaseRPC("get_user_preferences", {
        p_user_id: USER_ID_PREFERENCES,
      });
      expect(preferences.available_dumbbells_lbs).toEqual(
        DEFAULT_VALUES.AVAILABLE_DUMBBELLS_LBS,
      );
      expect(preferences.available_plates_lbs).toEqual(
        DEFAULT_VALUES.SELECTED_PLATES,
      );
      expect(preferences.default_rest_time).toEqual(120);
    });
  });
});
