// istanbul ignore file
// Stryker disable all
// This file is ignored by coverage and mutation testing tools.

// Because vitest runs tests in parallel, we should use a different user ID for
// each test file. This is only done by convention and not enforced in any way.
// If you think you've found some flakey tests, check that the user ID being
// used is actually unique for that test file.

export const USER_ID = {
  "personal_record_test@example.com": "00000000-0000-0000-0000-000000000002",
  "fullyseeded@example.com": "00000000-0000-0000-0000-000000000003",
  "user_preferences_test@example.com": "00000000-0000-0000-0000-000000000004",
  "personal_record_user_1@example.com": "aaaaaaaa-bbbb-cccc-dddd-000000000001",
  "add-custom-barbell-exercise.integration.test.tsx":
    "00000000-0000-0000-0001-000000000000",
  "add-custom-dumbbell-exercise.integration.test.tsx":
    "00000000-0000-0000-0001-000000000001",
  "add-wendler-block.integration.test.tsx":
    "00000000-0000-0000-0001-000000000002",
  "preferences.integration.test.tsx": "00000000-0000-0000-0001-000000000003",
};

const SET_OF_IDS = new Set(Object.values(USER_ID));
if (SET_OF_IDS.size !== Object.values(USER_ID).length) {
  throw new Error("Duplicate user IDs found, fix this.");
}
