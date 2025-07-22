import * as serverUtil from "@/serverUtil";
import { USER_ID_LOGGED_IN } from "@/test/constants";
import { getSession, requireLoggedInUser } from "@/test/serverUtil";
import { beforeEach, describe, expect, it, vi } from "vitest";

const supabase = serverUtil.getSupabaseClient();

const deleteAllExercisesForUser = async (userId: string) => {
  await supabase.from("exercises").delete().eq("user_id", userId);
};

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

// TODO - actually add in some tests here.
describe("User Journey: Add Wendler block", () => {
  it(`should allow a logged in user to add a wendler block`, async () => {
    expect(true).toBe(true); // Placeholder for actual test logic
  });
});
