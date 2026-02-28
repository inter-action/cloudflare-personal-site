playing with cloudflare services while building.

would also try all sorts of vibe-coding techniques. primarily use **opencode**.

**[code is cheap, show me the promts](./llm/chat-histories/session-001-project-init.md)**

## features

- a landing page
- a responsive blog
- support dark/light mode

### cloudflare services usage checklist

- [x] pages
- [x] page functions

## dev

see [AGENTS.md](./AGENTS.md)

### Git Hooks

Run `npm run dev:init` to set up git hooks (from `scripts/setup-git-hooks.sh`).

### cloudflare

```bash
npx wrangler login
```

### Prerequisites

For blog asset publishing, you need:

- **ffmpeg** - for image compression

  ```bash
  brew install ffmpeg
  ```

- **sqlite3** - for local database
  ```bash
  brew install sqlite3
  ```
