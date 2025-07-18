import type {
  requireLoggedInUser as RealRequireLoggedInUser,
  getSession as RealGetSession,
} from "@/serverUtil";

/**
 * Returns a function suitable for use as a mockImplementation for requireLoggedInUser from util.ts.
 * The returned function will return a fake session and userId, or throw to simulate redirect if the user is logged out.
 *
 * @param userId - The user id to use for the fake requireLoggedInUser.
 * @returns A function to use as mockImplementation for requireLoggedInUser.
 */
export const requireLoggedInUser = (userId: string) => {
  const impl: typeof RealRequireLoggedInUser = async (_currentPath: string) => {
    switch (userId) {
      // // If needed, we can simulate a logged out user by throwing an error
      // // like this. Isn't needed in tests yet, though.
      // case USER_ID_LOGGED_OUT:
      //   throw new Error(
      //     `redirect:/login?redirect-uri=${encodeURIComponent(currentPath)}`
      //   );
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
      // // If needed, we can simulate a logged out user by returning null
      // case USER_ID_LOGGED_OUT:
      //   return null;
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
