# Task: Fix TypeScript Module Resolution & Environment Errors

## 1. Context & Diagnosis
The project is hitting several "Cannot find module" errors for core dependencies and local path aliases. This is likely caused by one or more of the following:

- missing `node_modules` or uninstalled dependencies
- `tsconfig.json` missing `baseUrl`, so alias resolution for `@/*` fails
- wrong workspace root opening the nested `app` folder instead of the `crmef` project root

## 2. Step 1: Dependency Restoration
Run the following commands from the `crmef` project root:

```bash
cd /workspaces/CRMEF/crmef
npm install
```

If the repo is using a different package manager, use the equivalent install command.

## 3. Step 2: Fix `tsconfig.json` Configuration
Ensure `crmef/tsconfig.json` includes `baseUrl`, alias paths, and explicit types for React/Node resolution:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "ignoreDeprecations": "6.0",
    "types": ["node", "react", "react-dom"],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ]
}
```

This ensures `@/components/Navbar` resolves to `crmef/components/Navbar.tsx`.

## 4. Step 3: Verify Path Aliases & File Existence
- [ ] Confirm `crmef/app/globals.css` exists and is imported in `crmef/app/layout.tsx`.
- [ ] Confirm `crmef/components/Navbar.tsx` exists and is imported as `@/components/Navbar`.
- [ ] Confirm `crmef/lib/supabaseServer.ts` exists and `@supabase/supabase-js` is installed.
- [ ] Fix any casing mismatches in imports vs file names.

## 5. Step 4: Workspace Root / Double Folder Check
If VS Code is reporting paths like `/workspaces/CRMEF/app/app/layout.tsx`, the workspace may be opened at the wrong folder. Make sure the root workspace is:

```bash
/workspaces/CRMEF/crmef
```

Not the nested duplicate `app` folder.

## 6. Step 5: Environment Reset
If errors persist in VS Code:

- Restart the TypeScript Server: `Ctrl+Shift+P` -> "TypeScript: Restart TS Server"
- Delete build artifacts and rebuild:
  ```bash
  rm -rf .next node_modules
  npm install
  npm run dev
  ```

## 7. Expected Result
- Zero "Cannot find module" errors in `crmef/app/layout.tsx`
- `JSX.IntrinsicElements` errors cleared after `@types/react` is recognized
- Supabase import resolution working in `crmef/lib/supabaseServer.ts`
