import Page_Programs_Add from "@/app/programs/add/_components/_page_ProgramsAdd";
import * as serverUtil from "@/serverUtil";
import { TestIds } from "@/test-ids";
import { USER_ID } from "@/test/constants";
import { getSession, requireLoggedInUser } from "@/test/serverUtil";
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach } from "node:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

const supabase = serverUtil.getSupabaseClient();
const userId = USER_ID["add-program.integration.test.tsx"];

const deleteRelevantRowsForUser = async (userId: string) => {
  await supabase.from("exercises").delete().eq("user_id", userId);
  await supabase.from("wendler_program").delete().eq("user_id", userId);
  await supabase.from("form_drafts").delete().eq("user_id", userId);
};

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    requireLoggedInUser(userId),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(getSession(userId));

  await deleteRelevantRowsForUser(userId);
});

afterEach(async () => {
  await deleteRelevantRowsForUser(userId);
});

describe("User Journey: Add Program with none available", () => {
  it("should allow a user to add a new program", async () => {
    let page = await Page_Programs_Add();
    await act(async () => render(page));

    await act(async () => {
      const programNameInput = await waitFor(() =>
        screen.getByTestId(TestIds.Programs_Add_ProgramNameInput),
      );
      expect((programNameInput as HTMLInputElement).value).toBe(
        "Wendler Program 1",
      );

      const weightValues = await waitFor(() =>
        screen.getAllByTestId(TestIds.EditWeightInput),
      );
      for (const weightValue of weightValues) {
        expect((weightValue as HTMLInputElement).value).toBe("0");
      }
    });

    await act(async () => {
      await waitFor(() => screen.getAllByTestId(TestIds.EditWeightAdd(5))).then(
        (buttons) => buttons.map((btn) => btn.click()),
      );
      await waitFor(() =>
        screen.getAllByTestId(TestIds.EditWeightAdd(10)),
      ).then((buttons) => buttons.map((btn) => btn.click()));

      const weightValues = await waitFor(() =>
        screen.getAllByTestId(TestIds.EditWeightInput),
      );
      for (const weightValue of weightValues) {
        expect((weightValue as HTMLInputElement).value).not.toBe("0");
      }
      await waitFor(() =>
        screen.getByTestId(TestIds.Programs_Add_AddProgram),
      ).then((btn) => (btn as HTMLButtonElement).click());
    });

    await waitFor(async () => {
      const { data: actualPrograms } = await supabase
        .from("wendler_program")
        .select("*")
        .eq("user_id", userId);
      expect(actualPrograms?.length).toBe(1);

      const actualProgram = actualPrograms![0];
      expect(actualProgram.name).toBe("Wendler Program 1");
    });
  });
});
