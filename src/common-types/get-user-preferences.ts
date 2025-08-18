import { RequiredNonNullable } from "@/common-types";
import { Database } from "@/database.types";

type UserPreferencesDatabase =
  Database["public"]["Functions"]["get_user_preferences"]["Returns"];

export type UserPreferences = RequiredNonNullable<
  UserPreferencesDatabase,
  "user_id"
>;
