import PreferencesPage from "@/app/preferences/_page";
import { DEFAULT_VALUES } from "@/constants";
import * as serverUtil from "@/serverUtil";
import { supabaseRPC } from "@/serverUtil";
import { TestIds } from "@/test-ids";
import { USER_ID } from "@/test/constants";
import { getSession, requireLoggedInUser } from "@/test/serverUtil";
import { act, render, screen, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const supabase = serverUtil.getSupabaseClient();

const deleteRelevantRowsForUser = async (userId: string) => {
  await supabase.from("user_preferences").delete().eq("user_id", userId);
};

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    requireLoggedInUser(USER_ID["preferences.integration.test.tsx"]),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(
    getSession(USER_ID["preferences.integration.test.tsx"]),
  );
  await deleteRelevantRowsForUser(USER_ID["preferences.integration.test.tsx"]);
});

afterEach(async () => {
  await deleteRelevantRowsForUser(USER_ID["preferences.integration.test.tsx"]);
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
      .eq("user_id", USER_ID["preferences.integration.test.tsx"]);
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
          .eq("user_id", USER_ID["preferences.integration.test.tsx"]);
        expect(prefs?.length).toBeGreaterThan(0);
      });
    });

    // Assert the default settings were saved correctly.
    await waitFor(async () => {
      const preferences = await supabaseRPC("get_user_preferences", {
        p_user_id: USER_ID["preferences.integration.test.tsx"],
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

describe("User Journey: Can Navigate back if backTo is set", () => {
  beforeEach(async () => {
    // This any annoys me, but otherise I have to mock the entire module.
    vi.mocked(useSearchParams as any).mockImplementation(() => ({
      get: (key: string) =>
        key === "backTo" ? "/exercise/barbell_deadlift" : null,
      toString: () => "backTo=/exercise/barbell_deadlift",
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should show a Cancel button that navigates to the backTo location if present", async () => {
    let page = await PreferencesPage();
    await act(async () => render(page));

    await act(async () => {
      // There should be a Cancel button
      const cancelButton = await waitFor(() =>
        screen.getByTestId(TestIds.Preferences_CancelButton),
      );
      const path = new URL((cancelButton as HTMLAnchorElement).href).pathname;
      expect(path).toEqual("/exercise/barbell_deadlift");
    });
  });
});
