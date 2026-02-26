# AGENTS.md - Agentic Coding Guidelines

This document provides guidelines for AI agents working on this Cloudflare Pages personal site project.

## Project Overview

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Cloudflare Pages Functions (file-based routing)
- **Deployment**: Cloudflare Pages
- **Target**: Global edge deployment via Cloudflare CDN

## Build / Lint / Test Commands

### Development

```bash
npm run dev              # Run Vite + Wrangler concurrently (full dev experience)
npm run dev:vite        # Run Vite frontend only (port 5173)
npm run dev:worker      # Run Wrangler Pages dev server (port 8787)
```

### Building

```bash
npm run build           # Full build: TypeScript check + Vite build
npm run preview:prod    # Preview production build with Wrangler (serves both frontend + functions)
```

### Deployment

```bash
npm run deploy          # Deploy to Cloudflare Pages (runs scripts/deploy.sh)
```

### Linting / Formatting

```bash
npm run lint            # Run Prettier formatting on entire project
npm run fmt            # Format TypeScript files only
```

### Deployment

```bash
npm run deploy          # Deploy to Cloudflare Pages (runs scripts/deploy.sh)
```

### Linting / Formatting

```bash
npm run lint            # Run Prettier formatting on entire project
```

**Note**: There is currently no test framework configured. Tests are not being run.

## Code Style Guidelines

### Npm commands

- if a npm command script is too long, let's say if larger than 80 chars, then put them in a dedicated shell script in `scripts/npm-commands.sh` file.

### Formatting (Prettier)

- **Semicolons**: Yes (required)
- **Quotes**: Single quotes
- **Tab width**: 2 spaces
- **Trailing commas**: ES5 style
- **Print width**: 100 characters

Config file: `.prettierrc`

### TypeScript Configuration

- Strict mode enabled
- JSX: react-jsx
- Module resolution: bundler
- Path aliases: `@/*` maps to `src/*`

### React/Component Patterns

#### Component File Structure

```typescript
// Imports - React first, then external libs, then internal
import { useState, useEffect } from 'react'
import { SomeIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function for className merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

// Component variants using CVA
const buttonVariants = cva(
  'base classes...',
  {
    variants: {
      variant: { default: '...', outline: '...' },
    },
    defaultVariants: { variant: 'default' },
  }
)

// Type definitions
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

// Component implementation
function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}

export default Button
```

### Naming Conventions

- **Components**: PascalCase (e.g., `App`, `Button`, `Header`)
- **Functions/variables**: camelCase
- **Files**: PascalCase for components (`.tsx`), camelCase for utilities (`.ts`)
- **Interfaces**: PascalCase with descriptive names (e.g., `ApiResponse`)

### Import Order

1. React core imports
2. External library imports (lucide-react, etc.)
3. Internal project imports
4. Type imports (`type` keyword)

### Error Handling

- Use try/catch in async functions
- Always set loading states and clear errors appropriately
- Return proper HTTP status codes in API responses

### Tailwind CSS

- Use utility classes directly in JSX
- Use `cn()` utility to merge dynamic classes
- Color palette: slate (primary), cyan/blue (accents)
- Prefer `container mx-auto px-4` for page layouts

### Cloudflare Specific

- Workers types: `@cloudflare/workers-types`
- API routes use file-based routing in `functions/` directory
- Export `onRequest`, `onRequestGet`, `onRequestPost`, etc. handlers
- Use `context.next()` in middleware to pass to the next handler
- Frontend static files go in `src/` and build to `dist/`
- Configure in `wrangler.toml`

## File Structure

```
/functions/              # Cloudflare Pages Functions (file-based routing)
/src/App.tsx            # Main React component
/src/main.tsx           # React entry point
/src/index.css          # Tailwind CSS entry
/public/                # Static assets
/dist/                  # Build output
/wrangler.toml          # Cloudflare configuration
/tailwind.config.js     # Tailwind configuration
/tsconfig.json          # TypeScript configuration
```


## Common Tasks

### Adding a new API route
Create a new file in `functions/api/`:
```typescript
// functions/api/your-route.ts
export function onRequestGet(context) {
  return new Response(JSON.stringify({ data: '...' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
```

### Adding a new component
1. Create in appropriate directory under `src/components`
2. Use CVA for variants if component has multiple states
3. Use `cn()` utility for className merging

### Adding a new page/route
1. Add route in `App.tsx` or create new component
2. For API routes, add to `functions/api/`

## Git Hooks

Run `npm run dev:init` to set up git hooks (from `scripts/setup-git-hooks.sh`).