import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { Database } from "@/database.types";
import { auth } from "@/auth";
import { UserPreferences } from "@/common-types";

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

// Utility type that makes specified keys required and non-nullable
type RequiredNonNullable<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};

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
