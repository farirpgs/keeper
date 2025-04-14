# Copilot Instructions

## Tech Stack

This project uses the following technologies:

- Bun (for installing dependencies and running the project)
- Astro (the main framework)
- TypeScript
- React (for components)
- Radix Theme (for UI components)
- Tailwind CSS (for styling)
- Radix Icons (for icons)
- Lucide React (for icons as well)
- Zod (for validation)
- Prettier (for code formatting)
- Netlify (for deployment)

## React Components Rules

- Always receive props as a single object. Do not destructure props or props.children in the component function signature. Instead, access them using `props.propName` and `props.children`.
- If a React component is too complex or can be split into smaller chunks to enhance readability, define 'sub render functions' within the component.
- When refactoring a React component, favor 'sub render functions' over new components to prevent unnecessary props drilling.
- For 'sub render functions', their name should be prefixed with `render` and be defined inside the component function after the return statement.
- For 'sub render functions', they should use the props and context from the component as much as possible.
- For 'sub render functions', specific parameters (if any) should be passed as an object named `params` but never be destructured.
- For 'sub render functions', if a variable in the parent function scope is accessible, it should be used directly instead of passing it as a parameter.

```tsx
function MyComponent(props) {
  const someVariable = "some value";

  return <div>{renderSubComponent({ someOtherVariable: 3 })}</div>;

  function renderSubComponent(params: { someOtherVariable: number }) {
    console.log(someVariable);
    console.log(params.someOtherVariable);
    return <div>Sub Component</div>;
  }
}
```

- Use the function declaration syntax for the `useEffect` callback and always give those methods a good name.

```tsx
function MyComponent(props) {
  useEffect(function handleEffect() {
    // effect logic
  }, []);
}
```

## Syntax Rules

- For functions that are not callbacks, use the standard function syntax instead of arrow function syntax.

```tsx
function myFunction() {
  // function logic
}
```

- Use `type` over `interface`.

## Clean Code

- For all functions that are not 'sub render functions', wrap arguments (if any) in a single `params` object. Do not use destructuring and refer to properties using `params.paramName`.
- For complex operations, break the logic into multiple lines and use 'const' to store intermediate values rather than chaining many operations in a single line.
