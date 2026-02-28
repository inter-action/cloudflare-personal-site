# AGENTS.md - Agentic Coding Guidelines

## Project Overview

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Cloudflare Pages Functions (file-based routing in `functions/`)
- **Deployment**: Cloudflare Pages
- **Testing**: No test framework configured

## Commands

```bash
npm run dev          # Dev server (Vite + Wrangler concurrently)
npm run build       # TypeScript check + Vite build + blog generation
npm run deploy      # Build and deploy to Cloudflare Pages
npm run preview:prod # Preview production build locally
npm run ts:check    # TypeScript check (strict mode)
npm run fmt         # Prettier format (src/**/*.ts, src/**/*.tsx)
npm run build:blog  # to SSG blog contents.
```

## Self Verfication

```bash
npm run ts:check  # check cloudflare functions under `functions` folder
npm run build:fe # check build under `src` folder
npm run build:blog  # check blog building
npm run build # check all build
```

## AGENTS.md maintanence Guide line

- only update existing section. don't add new unless been explicitly told so!


## Code Style

### TypeScript

- Strict mode enabled
- Path alias: `@/*` maps to `src/*`
- Avoid `any`, prefer `unknown`
- Use `interface` for public APIs, `type` for unions/intersections

### Components

- PascalCase file names (e.g., `Button.tsx`, `Hero.tsx`)
- Use CVA (class-variance-authority) for component variants
- Use `cn()` utility from `../utils` for className merging
- Export props as `type` not `interface` (e.g., `export type ButtonProps = ...`)


### Error Handling

- Use typed error boundaries in React
- Return proper HTTP responses in API routes
- Never expose internal errors to clients

## File Structure

```
/
├── functions/           # Cloudflare Pages Functions (file-based routing)
├── src/                # React frontend
├── public/             # Static assets
└── blog/               # Blog related contents
```

## Skills

### Skills usage

- cloudflare: When working with Cloudflare services you're unfamiliar with, use the skill in `.opencode/skills/cloudflare`. It contains comprehensive documentation for:

### Skills installation

- use `npx skills add -a opencode <skill path>` to install skills, here some examples

```
# GitHub shorthand (owner/repo)
npx skills add vercel-labs/agent-skills

# Full GitHub URL
npx skills add https://github.com/vercel-labs/agent-skills
```

## Common Tasks


### Adding a New Component

1. Create in appropriate directory under `src/components`
2. Use CVA for variants if component has multiple states
3. Use `cn()` utility for className merging
4. Export props type and component function

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

export const myComponentVariants = cva('base-classes', {
  variants: {
    variant: { default: 'default-styles', outlined: 'outlined-styles' },
  },
  defaultVariants: { variant: 'default' },
});

export type MyComponentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof myComponentVariants>;

export function MyComponent({ className, variant, ...props }: MyComponentProps) {
  return <div className={cn(myComponentVariants({ variant }), className)} {...props} />;
}
```