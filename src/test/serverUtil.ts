import { Database } from "@/database.types";
import type {
  getSupabaseClient as RealGetSupabaseClient,
  requireLoggedInUser as RealRequireLoggedInUser,
  getSession as RealGetSession,
} from "@/serverUtil";
import { USER_ID_LOGGED_OUT, USER_ID_WITH_PREFERENCES } from "./constants";
import type { SupabaseClient } from "@supabase/supabase-js";
import { vi } from "vitest";

/**
 * Returns a function suitable for use as a mockImplementation for getSupabaseClient from util.ts.
 * The returned function returns a fake Supabase client for the given userId.
 *
 * @param userId - The user id to use for the fake client.
 * @returns A function to use as mockImplementation for getSupabaseClient.
 */
export const getSupabaseClient = (userId: string) => {
  // Helper to wrap a Promise in a minimal PostgrestFilterBuilder-like object
  function asPostgrestBuilder<T>(promise: Promise<T>) {
    return {
      then: promise.then.bind(promise),
      catch: promise.catch.bind(promise),
      finally: promise.finally.bind(promise),
    } as unknown as ReturnType<ReturnType<typeof RealGetSupabaseClient>["rpc"]>;
  }

  const rpc: ReturnType<typeof RealGetSupabaseClient>["rpc"] = vi.fn(
    (fn, _params) => {
      switch (fn) {
        case "get_user_preferences": {
          switch (userId) {
            case USER_ID_WITH_PREFERENCES:
              return asPostgrestBuilder(
                Promise.resolve({
                  data: [
                    {
                      preferred_weight_unit: "pounds",
                      default_rest_time_seconds: 90,
                      exercise_type: "barbell_bench_press",
                      one_rep_max_value: 225,
                      one_rep_max_unit: "pounds",
                      target_max_value: 250,
                      target_max_unit: "pounds",
                      user_id: USER_ID_WITH_PREFERENCES,
                    },
                    // Add a deadlift entry with a 1RM and no target max
                    {
                      preferred_weight_unit: "pounds",
                      default_rest_time_seconds: 90,
                      exercise_type: "barbell_deadlift",
                      one_rep_max_value: 400,
                      one_rep_max_unit: "pounds",
                      target_max_value: null,
                      target_max_unit: null,
                      user_id: USER_ID_WITH_PREFERENCES,
                    },
                  ],
                })
              );
            case USER_ID_LOGGED_OUT:
              return asPostgrestBuilder(Promise.resolve({ data: [] }));
            default:
              throw new Error(`Unhandled test user id: ${userId}`);
          }
        }
        case "update_user_one_rep_max":
        case "update_user_target_max":
          // Simulate a successful update
          return asPostgrestBuilder(
            Promise.resolve({ error: null, data: null })
          );
        // Add more cases as needed for other RPCs
        case "add_exercise_block":
        case "add_leg_day_superblock":
        case "create_exercise":
        case "get_exercise_blocks_for_superblock":
        case "get_exercise_for_user":
        case "get_exercises_by_type_for_user":
        case "normalize_bar_weight":
        case "round_to_nearest_5":
        case "update_exercise_for_user":
        case "wendler_exercise_block":
          throw new Error(
            `Fake for Supabase RPC '${String(fn)}' not implemented. Please add a fake implementation.`
          );
        default:
          throw new Error(
            `No fake implementation for Supabase RPC: '${String(fn)}'.`
          );
      }
    }
  );
  const impl: typeof RealGetSupabaseClient = () => {
    // Return the mock rpc so tests can assert on it
    return { rpc } as unknown as SupabaseClient<Database>;
  };
  return impl;
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
