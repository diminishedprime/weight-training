# Copilot Instructions

This project is a next.js application that uses Typescript and Material UI.

## Coding Standards

- prefer defining components as `const function_name = () => { ... }`
- try to avoid providing values if they're the default values
  - for example, don't write `variant="text"` if the default variant is text
- prefer to keep files relatively short. If a file is getting long (> 150 lines), consider splitting it into smaller components or files.
- Don't use `inputProps`, they're deprcated in the version of MUI we're using.
- Whenever you need to use a client-side hook (like `useState`, `useEffect`, etc.), make sure to add `use client` at the top.
  - If you need to use server functionality such as querying the database, or `useSession`, create a wrapper component of the same name called `ServerComponentName`.
- If you need to use a server action, put it in a file in the same component called `actions.ts`
  - If you're doing that in a component that is in the `src/components/` directory, put the actions in `src/components/ComponentName/actions.ts`
- Minimize the amount of css that you're using. Prefer using default MUI components.
- This is primarily a mobile application, so make sure styles look good on mobile devices and account for the smaller screen size.
  - Make frequent use of automatic wrapping, such as using `flexWrap: 'wrap'` in flexbox containers.
- Prefer using the variable name `props` and then dustructuring in the body of the function instead of destructuring in the function signature.
- Prefer using `Stack` over `Box` for layout purposes.
  - When using `Stack`, also use `useFlexGap` if any children will need a top-margin.
- Only use the `any` type as a last resort. If you need to use it, add a comment explaining why.
- Prefer explictly typing react components with definitions such as `React.FC<PropType>`
- Prefer export default over named exports.
- Whenever a component needs logic outside of display, such as useState, etc., pull that out into a hook.
  - This hook should use an `api` style, and when used it shouldn't be dustructured, but instead used as `const componentAPI = useComponentAPI()` and then `componentAPI.field`, etc. for use.
- When there is a lot of state management instead an API hook, consider using the redux-style useReducer hook.
