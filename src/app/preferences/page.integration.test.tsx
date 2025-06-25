import { vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from "react";
import PreferencesPage from "@/app/preferences/page";
import { describe, it, expect, beforeEach } from "vitest";
import { USER_ID_LOGGED_IN, USER_ID_LOGGED_OUT } from "@/test/constants";
import * as fakeServerUtil from "@/test/serverUtil";
import * as serverUtil from "@/serverUtil";
import { getExercisePreferenceTestIds } from "@/app/preferences/_components/SetExercisePreferences";
import {
  EQUIPMENT_CHIP_TESTID_ALL,
  EQUIPMENT_CHIP_TESTID_NONE,
  getEquipmentChipTestIds,
} from "@/app/preferences/_components/EquipmentChipFilters";
import { FUZZY_SEARCH_FIELD_TESTID } from "@/app/preferences/_components/FuzzySearchField";
import { exerciseSorter } from "@/util";
import { getSupabaseClient } from "@/serverUtil";
import { Constants, Database } from "@/database.types";

describe("PreferencesPage", () => {
  // Resets all relevant test data for a given userId in the database.
  // IMPORTANT: If you add tests that mutate additional state for this userId in the DB,
  // you must update this function to also reset that state. This ensures test isolation
  // and prevents flaky tests due to leftover data from previous runs.
  const resetTestData = async (userId: string) => {
    const supabase = getSupabaseClient();
    // Delete all 1RM history for this user and exercise to fully reset state
    // since we have triggers to handle this all in history.
    await supabase
      .from("user_one_rep_max_history")
      .delete()
      .eq("user_id", userId)
      .eq("exercise_type", "barbell_back_squat");
    // Also clear canonical values in user_exercise_weights
    await supabase
      .from("user_exercise_weights")
      .update({
        one_rep_max_weight_id: null,
        target_max_weight_id: null,
      })
      .eq("exercise_type", "barbell_back_squat")
      .eq("user_id", userId);
  };

  beforeEach(async () => {
    await resetTestData(USER_ID_LOGGED_IN);
    vi.restoreAllMocks();
  });

  it("renders successfully with preferences data", async () => {
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_IN)
    );
    render(await PreferencesPage());
    await waitFor(() => {
      expect(
        screen.getAllByText(/Exercise Preferences/i).length
      ).toBeGreaterThan(0);
    });
  });

  it("redirects to login with correct url if user is not logged in", async () => {
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_OUT)
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
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_IN)
    );
    render(await PreferencesPage());
    const testIds = getExercisePreferenceTestIds("barbell_back_squat");
    await waitFor(() => {
      expect(screen.getByTestId(testIds.oneRepMaxInput)).toBeInTheDocument();
    });
    const oneRepMaxInput = screen.getByTestId(
      testIds.oneRepMaxInput
    ) as HTMLInputElement;
    expect(oneRepMaxInput.value).toBe("");
    await act(async () => {
      fireEvent.change(oneRepMaxInput, { target: { value: "315" } });
    });
    const saveButton = screen.getByTestId(testIds.saveOneRepMax);
    expect(saveButton).toBeTruthy();
    await act(async () => {
      saveButton.click();
    });
    await waitFor(() => {
      expect(oneRepMaxInput!.value).toBe("315");
    });
  });

  it("can modify a back_squat target max", async () => {
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_IN)
    );
    render(await PreferencesPage());
    const testIds = getExercisePreferenceTestIds("barbell_back_squat");
    await waitFor(() => {
      expect(screen.getByTestId(testIds.targetMaxInput)).toBeInTheDocument();
    });
    const targetMaxInput = screen.getByTestId(
      testIds.targetMaxInput
    ) as HTMLInputElement;
    expect(targetMaxInput.value).toBe("");
    await act(async () => {
      fireEvent.change(targetMaxInput, { target: { value: "285" } });
    });
    const targetMaxSaveButton = screen.getByTestId(testIds.saveTargetMax);
    expect(targetMaxSaveButton).toBeTruthy();
    await act(async () => {
      targetMaxSaveButton.click();
    });
    await waitFor(() => {
      expect(targetMaxInput!.value).toBe("285");
    });
  });

  // Note this is taking advantage of the fact that our sorting logic will
  // always put back_squat first.
  it("shows back_squat as the first SetExercisePreferences row that can be changed", async () => {
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_IN)
    );
    render(await PreferencesPage());
    // Find the container for all exercise preferences
    const list = screen.getByTestId("exercise-preferences-list");
    expect(list).toBeTruthy();
    // The first child should be the backsquat row, check for a backsquat-specific testid
    const firstChild = list.firstElementChild as HTMLElement;
    expect(firstChild).toBeTruthy();
    // Use the backsquat-specific testid for the one rep max input
    const backsquatInput = firstChild.querySelector(
      '[data-testid="one-rep-max-input-barbell_back_squat"]'
    );
    expect(backsquatInput).toBeTruthy();
  });

  describe("for the equipment chip filters", () => {
    beforeEach(async () => {
      vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
        fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_IN)
      );
      render(await PreferencesPage());
      await waitFor(() => {
        expect(
          screen.getByTestId(EQUIPMENT_CHIP_TESTID_ALL)
        ).toBeInTheDocument();
      });
    });

    it("are all selected by default", () => {
      const allEquipmentTypes = Constants.public.Enums.equipment_type_enum;
      for (const type of allEquipmentTypes) {
        const testId = getEquipmentChipTestIds(type)!;
        const chip = screen.getByTestId(testId);
        expect(chip).toHaveClass("MuiChip-colorPrimary");
      }
    });

    describe("when all are deselected", () => {
      beforeEach(async () => {
        const noneChip = screen.getByTestId(EQUIPMENT_CHIP_TESTID_NONE);
        await act(async () => {
          fireEvent.click(noneChip);
        });
      });

      it("none are selected and no exercise preferences rows are visible", () => {
        const allEquipmentTypes = Constants.public.Enums.equipment_type_enum;
        for (const type of allEquipmentTypes) {
          const testId = getEquipmentChipTestIds(type)!;
          const chip = screen.getByTestId(testId);
          expect(chip).not.toHaveClass("MuiChip-colorPrimary");
        }
        expect(screen.queryAllByTestId("exercise-preference-row").length).toBe(
          0
        );
      });

      it("clicking all reselects all chips", async () => {
        const allEquipmentTypes = Constants.public.Enums.equipment_type_enum;
        const allChip = screen.getByTestId(EQUIPMENT_CHIP_TESTID_ALL);
        await act(async () => {
          fireEvent.click(allChip);
        });
        for (const type of allEquipmentTypes) {
          const testId = getEquipmentChipTestIds(type)!;
          const chip = screen.getByTestId(testId);
          expect(chip).toHaveClass("MuiChip-colorPrimary");
        }
      });

      it("clicking barbell only shows barbell filters", async () => {
        const barbellTestId = getEquipmentChipTestIds("barbell")!;
        const barbellChip = screen.getByTestId(barbellTestId);
        await act(async () => {
          fireEvent.click(barbellChip);
        });
        const rows = screen.queryAllByTestId("exercise-preference-row");
        expect(rows.length).toBeGreaterThan(0);
        for (const row of rows) {
          const name = row.querySelector('[data-testid="exercise-name"]');
          expect(name?.textContent?.toLowerCase()).toContain("barbell");
        }
      });

      it("clicking barbell only shows barbell filters, and clicking again hides all barbell exercises", async () => {
        const barbellTestId = getEquipmentChipTestIds("barbell")!;
        const barbellChip = screen.getByTestId(barbellTestId);
        await act(async () => {
          fireEvent.click(barbellChip);
        });
        let rows = screen.queryAllByTestId("exercise-preference-row");
        expect(rows.length).toBeGreaterThan(0);
        for (const row of rows) {
          const name = row.querySelector('[data-testid="exercise-name"]');
          expect(name?.textContent?.toLowerCase()).toContain("barbell");
        }
        // Click barbell again to deselect
        await act(async () => {
          fireEvent.click(barbellChip);
        });
        rows = screen.queryAllByTestId("exercise-preference-row");
        // There should be no barbell exercises visible
        for (const row of rows) {
          const name = row.querySelector('[data-testid="exercise-name"]');
          expect(name?.textContent?.toLowerCase()).not.toContain("barbell");
        }
      });
    });
  });

  describe("sortPreferencesData", () => {
    describe("exerciseSorter", () => {
      const make = (
        type: Database["public"]["Enums"]["exercise_type_enum"]
      ) => ({ exercise_type: type });

      it("returns -1 when a's equipment is before b's", () => {
        expect(
          exerciseSorter(make("barbell_bench_press"), make("dumbbell_row"))
        ).toBe(-1);
      });

      it("returns 1 when a's equipment is after b's", () => {
        expect(
          exerciseSorter(
            make("machine_converging_chest_press"),
            make("barbell_bench_press")
          )
        ).toBe(1);
      });

      it("returns -1 when equipment is the same and a's exercise_type is before b's", () => {
        expect(
          exerciseSorter(
            make("barbell_bench_press"),
            make("barbell_overhead_press")
          )
        ).toBe(-2);
      });

      it("returns 1 when equipment is the same and a's exercise_type is after b's", () => {
        expect(
          exerciseSorter(make("barbell_row"), make("barbell_bench_press"))
        ).toBe(2);
      });

      it("returns 0 when both equipment and exercise_type are the same", () => {
        expect(
          exerciseSorter(
            make("barbell_bench_press"),
            make("barbell_bench_press")
          )
        ).toBe(0);
      });
    });
  });

  describe("search field integration", () => {
    it("filters to only barbell squat row when searching for 'barbell_front_squat'", async () => {
      vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
        fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_IN)
      );
      render(await PreferencesPage());
      await waitFor(() => {
        expect(
          screen.getByTestId(FUZZY_SEARCH_FIELD_TESTID)
        ).toBeInTheDocument();
      });
      const searchField = screen.getByTestId(FUZZY_SEARCH_FIELD_TESTID);
      await act(async () => {
        fireEvent.change(searchField, {
          target: { value: "barbell_front_squat" },
        });
      });
      await waitFor(() => {
        const rows = screen.queryAllByTestId("exercise-preference-row");
        expect(rows.length).toBe(1);
        const name = rows[0].querySelector('[data-testid="exercise-name"]');
        expect(name?.textContent?.toLowerCase()).toContain(
          "front squat (barbell)"
        );
      });
    });

    it("clears the search when the x button is clicked", async () => {
      vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
        fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_IN)
      );
      render(await PreferencesPage());
      await waitFor(() => {
        expect(
          screen.getByTestId(FUZZY_SEARCH_FIELD_TESTID)
        ).toBeInTheDocument();
      });
      const searchField = screen.getByTestId(FUZZY_SEARCH_FIELD_TESTID);
      await act(async () => {
        fireEvent.change(searchField, {
          target: { value: "barbell_front_squat" },
        });
      });
      await waitFor(() => {
        const rows = screen.queryAllByTestId("exercise-preference-row");
        expect(rows.length).toBe(1);
      });
      // Find and click the clear (x) button
      const clearButton = screen.getByRole("button", { name: /clear/i });
      await act(async () => {
        fireEvent.click(clearButton);
      });
      // After clearing, there should be more than one row visible
      await waitFor(() => {
        const rows = screen.queryAllByTestId("exercise-preference-row");
        expect(rows.length).toBeGreaterThan(1);
      });
    });
  });

  it("disables the save button for default rest time when the field is cleared", async () => {
    const backSquatTestIds = getExercisePreferenceTestIds("barbell_back_squat");
    vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
      fakeServerUtil.requireLoggedInUser(USER_ID_LOGGED_IN)
    );
    render(await PreferencesPage());
    // Wait for the default rest time input to appear
    await waitFor(() => {
      expect(
        screen.getByTestId(backSquatTestIds.restTimeInput)
      ).toBeInTheDocument();
    });
    const restTimeInput = screen.getByTestId(
      backSquatTestIds.restTimeInput
    ) as HTMLInputElement;
    // Clear the input
    await act(async () => {
      fireEvent.change(restTimeInput, { target: { value: "" } });
    });
    // The save button should be disabled
    const saveButton = screen.getByTestId(backSquatTestIds.saveRestTime);
    expect(saveButton).toBeDisabled();
  });
});
