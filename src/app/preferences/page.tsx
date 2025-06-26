"use server";

import { requireLoggedInUser, getSupabaseClient } from "@/serverUtil";
import PreferencesClient from "@/app/preferences/_components/PreferencesClient";
import { sortPreferencesData } from "@/util";

// TODO(matt) - Eventually, I'll probably want a component that's specifically
// for setting the target max, this component should be aware of what the
// one-rep-max is if set, and show the % of the one-rep-max that the current
// target max is. Additionally, it should have a button that can bump the weight
// by 5lbs or 10lbs depenpending on if it's it's a leg or arm workout.

/**
 * User Preferences Page (Server Component)
 *
 * This page is responsible for displaying and managing all exercise-related
 * user preferences.  It ensures the user is authenticated, fetches all relevant
 * preference data from the database, and passes it to the client-side UI for
 * editing and display. This enables users to view and update their exercise
 * settings (such as one-rep max, target max, and rest times) in a single,
 * cohesive interface.
 *
 * The page enforces that only logged-in users can access preferences, and will
 * throw an error if the user's preference data is missing (which should not
 * occur in normal operation).
 *
 * Usage: Rendered at `/preferences` for authenticated users. Supports all flows
 * for updating exercise preferences, and is the entry point for user
 * customization of training parameters.
 *
 * @returns The preferences management UI for the current user.
 */
export default async function PreferencesPage() {
  const { userId } = await requireLoggedInUser("/preferences");

  const supabase = getSupabaseClient();

  const { data: preferencesData } = await supabase.rpc("get_user_preferences", {
    p_user_id: userId,
  });

  // No preference data is an invalid invariant. Hopefully this error message
  // never shows. The user already would have been redirected to the login page
  // if they weren't logged in. This error would mean the trigger that sets up
  // preferences data doesn't work, or supabase is broken.
  // Stryker disable next-line all
  if (!preferencesData) {
    throw new Error(
      "No preferences data returned from get_user_preferences. This likely means your user is not set up correctly in the database. Reach out to the developer for help getting this resolved.",
    );
  }
  // Stryker restore all

  // Sort preferences data before rendering
  // @ts-expect-error - I can't prove this invriant because the database doesn't have
  //                   good enough type generation, but I promise the inners aren't
  //                   null.
  sortPreferencesData(preferencesData);

  return <PreferencesClient userPreferencesRows={preferencesData} />;
}
