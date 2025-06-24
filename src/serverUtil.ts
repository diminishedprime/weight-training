import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { Database } from "@/database.types";
import { auth } from "@/auth";

/**
 * Returns a Supabase client instance for server-side usage.
 */
export const getSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

/**
 * Ensures the user is logged in, otherwise redirects to login page.
 * @param currentPath The path the user is trying to access.
 * @returns The session and userId if logged in.
 */
export async function requireLoggedInUser(
  currentPath: string
): Promise<{ session: Session; userId: string }> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    const encoded = encodeURIComponent(currentPath);
    redirect(`/login?redirect-uri=${encoded}`);
  }
  return { session, userId };
}

/**
 * Returns the current session using next-auth's auth().
 * This indirection makes it easy to mock in tests.
 */
export const getSession = () => auth();
