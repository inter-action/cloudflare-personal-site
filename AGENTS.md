# AGENTS.md - Agentic Coding Guidelines

## Project Overview

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Cloudflare Pages Functions (file-based routing in `functions/`)
- **Deployment**: Cloudflare Pages

## Commands

```bash
npm run dev          # Dev server (Vite + Wrangler)
npm run build        # TypeScript check + Vite build
npm run deploy       # Deploy to Cloudflare Pages
npm run lint         # Prettier formatting
npm run ts:check     # TypeScript check
```

## Code Style

- **Prettier**: Semicolons, single quotes, 2 spaces, trailing commas (ES5), print width 100
- **Components**: PascalCase files, use CVA for variants, `cn()` from clsx/tailwind-merge for className merging
- **Import order**: React → external libs → internal → types


### typescript
- Strict mode, path alias `@/*` → `src/*` under src folder
- avoid using any, prefer unknown.

## File Structure

```
/functions/     # Cloudflare Pages Functions (file-based routing)
/src/           # React frontend
/public/        # Static assets
/dist/          # Build output
```

## common tasks
### Adding API Routes

```typescript
// functions/api/your-route.ts
export function onRequestGet(context: any) {
  return new Response(JSON.stringify({ data: '...' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```
### Adding a new component
1. Create in appropriate directory under `src/components`
2. Use CVA for variants if component has multiple states
3. Use `cn()` utility for className merging
