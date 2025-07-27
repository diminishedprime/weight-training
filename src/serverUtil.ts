import { auth } from "@/auth";
import { RequiredNonNullable, UserPreferences } from "@/common-types";
import { FIRST_PAGE_NUM } from "@/constants";
import { Database } from "@/database.types";
import { createClient } from "@supabase/supabase-js";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

/**
 * Returns a Supabase client instance for server-side usage.
 */
export const getSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};

/**
 * Ensures the user is logged in, otherwise redirects to login page.
 * @param currentPath The path the user is trying to access.
 * @returns The session and userId if logged in.
 */
export async function requireLoggedInUser(
  currentPath: string,
): Promise<{ session: Session; userId: string }> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    const encoded = encodeURIComponent(currentPath);
    redirect(`/login?redirect-uri=${encoded}`);
  }
  return { session, userId };
}

// This function retrieves user preferences from the database and ensures that
// values that are required (indicated via) requiredKeys are non-null. If they
// aren't non-null, it redirects the user to the preferences page with a query param that
// indicates which preferences are missing.
//
// The user preferences page is set up such that it will redirect the user back
// to the original page once those values are saved onSubmit
export async function requirePreferences<K extends keyof UserPreferences>(
  userId: string,
  requiredKeys: K[],
  backTo: string,
): Promise<RequiredNonNullable<UserPreferences, K>> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_user_preferences", {
    p_user_id: userId,
  });
  if (error) {
    throw new Error(`Failed to get user preferences: ${error.message}`);
  }

  if (!data) {
    const urlParams = new URLSearchParams({
      requiredPreferences: requiredKeys.join(","),
      backTo: backTo,
    });
    redirect(`/preferences?${urlParams.toString()}`);
  }

  const missingKeys: K[] = [];
  for (const key of requiredKeys) {
    const value = data[key];
    if (value === null || value === undefined) {
      missingKeys.push(key);
    } else {
      switch (key) {
        case "available_kettlebells_lbs":
        case "available_plates_lbs":
        case "available_dumbbells_lbs":
          if (!Array.isArray(value) || value.length === 0) {
            missingKeys.push(key);
          }
          break;
        default:
          break;
      }
    }
  }

  if (missingKeys.length > 0) {
    const urlParams = new URLSearchParams({
      requiredPreferences: missingKeys.join(","),
      backTo: backTo,
    });
    redirect(`/preferences?${urlParams.toString()}`);
  }

  // Type assertion is safe here because we've validated that all required keys
  // are non-null
  return data as RequiredNonNullable<UserPreferences, K>;
}

/**
 * Returns the current session using next-auth's auth().
 * This indirection makes it easy to mock in tests.
 */
export const getSession = () => auth();

/**
 * Calls a Supabase RPC function with type safety from the generated Database types.
 *
 * This rethrows any functions and assumes that it'll be called within a server
 * context where thrown errors route to the nearest error boundary. For
 * scenarios where you can properly handle the error locally, use the regular
 * getSupabaseClient().rpc(...) functionality.
 *
 * @param fnName - The name of the RPC function (must exist in Database['functions'])
 * @param rpcArgs - The arguments for the RPC function
 * @returns The result of the RPC call
 */
export const supabaseRPC = async <
  T extends keyof Database["public"]["Functions"],
  Args extends Database["public"]["Functions"][T]["Args"],
  Return = Database["public"]["Functions"][T]["Returns"],
>(
  fnName: T,
  rpcArgs: Args,
): Promise<Return> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc(fnName, rpcArgs);
  if (error) {
    console.error({ error });
    console.error(`Error calling RPC ${String(fnName)}:`, error);
    // Ignore cancellation errors (e.g., debounced/aborted fetch)
    if (
      typeof error.message === "string" &&
      error.message.includes("The operation was aborted")
    ) {
      // Optionally log, but do not throw
      console.warn(
        `RPC ${String(fnName)} was aborted (likely due to cancellation).`,
      );
      return null as Return;
    }
    const errorMsg = `Failed to call RPC ${String(fnName)}: ${error.message} ${error.code ? `Code: ${error.code}\n` : ""}${error.details ? `Details: ${error.details}\n` : ""}${error.hint ? `Hint: ${error.hint}\n` : ""}`;
    throw new Error(errorMsg);
  }
  return data as Return;
};

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

type PossibleParsers = (searchParams: SearchParams) => Record<string, unknown>;

type JoinedParsers<ActualParser extends readonly PossibleParsers[]> =
  ActualParser extends readonly [
    infer First extends PossibleParsers,
    ...infer Rest extends PossibleParsers[],
  ]
    ? ReturnType<First> & JoinedParsers<Rest>
    : object;

export const parseSearchParams = async <
  ActualParsers extends readonly PossibleParsers[],
>(
  searchParamsPromise: Promise<SearchParams>,
  ...paramParsers: readonly [...ActualParsers]
): Promise<JoinedParsers<ActualParsers>> => {
  const searchParams = await searchParamsPromise;
  const parsedParams = paramParsers.reduce(
    (acc, parser) => ({ ...acc, ...parser(searchParams) }),
    {},
  );
  return parsedParams as JoinedParsers<ActualParsers>;
};

// Add new search param parsers here as needed, they should take a SearchParams
// and return an object with the friendly key, and parsed value.
export const SEARCH_PARSERS = {
  PAGE_NUM: (searchParams: SearchParams) => ({
    pageNum: Number(searchParams.page_num) || FIRST_PAGE_NUM,
  }),
};
