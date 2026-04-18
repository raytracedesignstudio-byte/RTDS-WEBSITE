# RayTrace Frontend (Standalone)

Standalone React + Vite frontend rebuilt outside the old Replit monorepo.

## Run

```bash
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:5173`.

## API Wiring

- Default API base in code: `/api`
- Dev proxy in `vite.config.ts` forwards `/api` -> `http://localhost:4000`
- Optional override: set `VITE_API_URL` in `.env`

## Build

```bash
pnpm build
pnpm serve
```

## Notes

- UI and page structure are kept aligned with the original app.
- Replit-only config/plugins were removed.
