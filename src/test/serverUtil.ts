import { Constants } from "@/database.types";
import { Database } from "@/database.types";
import type {
  requireLoggedInUser as RealRequireLoggedInUser,
  getSession as RealGetSession,
} from "@/serverUtil";
import { USER_ID_LOGGED_OUT, USER_ID_LOGGED_IN } from "./constants";

/**
 * Generates a full set of user preference rows for all exercise types, matching the DB invariant.
 * Used in tests for USER_ID_WITH_PREFERENCES to simulate a real user with all rows present.
 */
export const get_user_preferences_default_rows = (
  userId: string
): Array<Database["public"]["Tables"]["user_exercise_weights"]["Row"]> => {
  return Constants.public.Enums.exercise_type_enum.map((exercise_type, idx) => {
    return {
      id: `mock-id-${userId}-${exercise_type}`,
      user_id: userId,
      exercise_type,
      preferred_weight_unit: "pounds",
      default_rest_time_seconds: 90,
      one_rep_max_weight_id: null,
      target_max_weight_id: null,
      created_at: null,
    };
  });
};

/**
 * Returns a function suitable for use as a mockImplementation for requireLoggedInUser from util.ts.
 * The returned function will return a fake session and userId, or throw to simulate redirect if the user is logged out.
 *
 * @param userId - The user id to use for the fake requireLoggedInUser.
 * @returns A function to use as mockImplementation for requireLoggedInUser.
 */
export const requireLoggedInUser = (userId: string) => {
  const impl: typeof RealRequireLoggedInUser = async (currentPath: string) => {
    switch (userId) {
      case USER_ID_LOGGED_OUT:
        throw new Error(
          `redirect:/login?redirect-uri=${encodeURIComponent(currentPath)}`
        );
      default:
        return {
          session: {
            user: {
              id: userId,
              name: "Test User",
              email: `${userId}@example.com`,
              image: "https://example.com/avatar.png",
            },
            expires: "2099-01-01T00:00:00.000Z",
          },
          userId,
        };
    }
  };
  return impl;
};

/**
 * Returns a function suitable for use as a mockImplementation for getSession from util.ts.
 * The returned function returns a fake session object for the given userId, or null for USER_ID_LOGGED_OUT.
 *
 * @param userId - The user id to use for the fake session.
 * @returns A function to use as mockImplementation for getSession.
 */
export const getSession = (userId: string) => {
  const impl: typeof RealGetSession = async () => {
    switch (userId) {
      case USER_ID_LOGGED_OUT:
        return null;
      default:
        return {
          user: {
            id: userId,
            name: "Test User",
            email: `${userId}@example.com`,
            image: "https://example.com/avatar.png",
          },
          expires: "2099-01-01T00:00:00.000Z",
        };
    }
  };
  return impl;
};
