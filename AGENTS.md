# AGENTS.md - Agentic Coding Guidelines

This document provides guidelines for AI agents working on this Cloudflare Pages personal site project.

## Project Overview

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Hono API running on Cloudflare Workers
- **Deployment**: Cloudflare Pages with Workers integration
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
npm run build:api       # Build Hono API worker to dist/_worker.js
npm run preview         # Preview production build locally
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
2. External library imports (lucide-react, hono, etc.)
3. Internal project imports
4. Type imports (`type` keyword)

### Error Handling
- Use try/catch in async functions
- Always set loading states and clear errors appropriately
- Hono API: use `.notFound()` handler for 404s
- Return proper HTTP status codes in API responses

### Tailwind CSS
- Use utility classes directly in JSX
- Use `cn()` utility to merge dynamic classes
- Color palette: slate (primary), cyan/blue (accents)
- Prefer `container mx-auto px-4` for page layouts

### Hono API (Cloudflare Workers)
- Use Hono's context (`c`) for request/response handling
- Enable CORS with `app.use('*', cors())`
- Export default app instance
- Return JSON with `c.json()`, text with `c.text()`

### Cloudflare Specific
- Workers types: `@cloudflare/workers-types`
- API routes go in `api/index.ts` and build to `dist/_worker.js/`
- Frontend static files go in `src/` and build to `dist/`
- Configure in `wrangler.toml`

## File Structure
```
/api/index.ts           # Hono API worker
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
Add to `api/index.ts`:
```typescript
app.get('/api/your-route', (c) => {
  return c.json({ data: '...' })
})
```

### Adding a new component
1. Create in appropriate directory under `src/components`
2. Use CVA for variants if component has multiple states
3. Use `cn()` utility for className merging

### Adding a new page/route
1. Add route in `App.tsx` or create new component
2. For API routes, add to `api/index.ts`

## Git Hooks
Run `npm run dev:init` to set up git hooks (from `scripts/setup-git-hooks.sh`).
