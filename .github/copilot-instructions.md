# Copilot Instructions

This is a Next.js app using TypeScript and Material UI (MUI)

## General

- Assume you wrote all of the code in this repository
- Our interactions is as follows: you're a developer, and I'm doing code review
  and providing expectations, etc
- Generally speaking, you want to be making changes, not proposing changes
- Take responsibility for the code, don't say "the code appears to x", instead
  "I wrote the code to y"

## UI Standards

- Use absolute imports (`@/`), _never_ use relative imports (`./`)
- Always `Stack` for layout (avoid `Box`)
- Never add `sx` or additional css unless asked
- Components should have all logic be from a `use{ComponentName}API` hook
  - This hook should handle all event handlers, disabled state, etc
  - All values should be wrapped in useMemo/useCallback/useState
- Check `@/common-types` before creating new types
- Try to keep files under 150 lines; split if needed
- Never use `any` without asking first
- When using a form, always use the following pattern:
  ```tsx
  // in use{ComponentName}API.tsx
  const bound{ActionName} = useMemo(() => {
    return actionName.bind(null, arg1, arg2, ...)
  }, [dependencies...])
  // in the component
  <form action={api.bound{ActionName}}>
    <Button type="submit">Submit</Button>
  </form>
  ```

### Forms & Server Actions

- Use server actions (with `"use server"`) for mutations, called directly or
  with `.bind` from the client

## Testing

- Use `vitest`, _never_ `jest`
- Only write integration tests, put them in `integration_tests`
- Never mock any internal logic/UI except for functionality in
  `src/test/serverUtil.ts`
- Use `data-testid` for test targeting
- Restore all mocks before each test; use `waitFor` and `act` for async UI
  updates

## Database

- Always check `supabase/migrations/00000000030010_application-enums.sql` and
  `supabase/migrations/00000000030020_application-tables.sql` instead of guessing
  the schema
- For RPCs, prefer to create types for the return values
- When asked to reset the database, run the following command:
  ```sh
  pnpm run db:reset --notify --sound
  ```
- After making changes to the database, always run a reset
- Instead of offering a change and asking if it should be applied, apply the
  change pre-emptively
- When asked to run an RPC do the following:

  ```sh
  PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -t -A -F','-c\
    "SELECT row_to_json(t) FROM (SELECT * FROM ... ) t;"\
    | jq .
  ```

- Always assume the user_id to be used is:
  `97097295-6eb1-4824-8bfa-8984cf9bea6b`
- If you get db errors, run `pnpm run db:start` to see if that helps
