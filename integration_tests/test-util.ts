import { USER_ID } from "@/test/constants";
import { getSession, requireLoggedInUser } from "@/test/serverUtil";
import { vi } from "vitest";

export const commonBeforeEach = (
  userKey: keyof typeof USER_ID,
  serverUtil: typeof import("@/serverUtil"),
) => {
  vi.restoreAllMocks();
  vi.spyOn(serverUtil, "requireLoggedInUser").mockImplementation(
    requireLoggedInUser(USER_ID[userKey]),
  );
  vi.spyOn(serverUtil, "getSession").mockImplementation(
    getSession(USER_ID[userKey]),
  );
  return USER_ID[userKey];
};
