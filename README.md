# RayTrace Frontend (Standalone)

Standalone React + Vite frontend rebuilt outside the old Replit monorepo.

## Run

```bash
pnpm install
pnpm dev
```

Frontend runs on http://localhost:5173.

## API Wiring

- Default API base in code: /api
- Dev proxy in vite.config.ts forwards /api -> http://localhost:4000
- Production: set VITE_API_URL in your environment (example: https://api.example.com/api)

## Build

```bash
pnpm build
pnpm serve
```

## Vercel Deployment

1. Import this repo in Vercel and set the root directory to raytrace-fe.
2. Build settings are defined in vercel.json:
   - Build Command: pnpm build
   - Output Directory: dist
3. Add environment variable in Vercel project settings:
   - VITE_API_URL = your backend API base URL (example: https://api.example.com/api)
4. Redeploy.

## Notes

- vercel.json includes SPA rewrites so deep links like /projects/slug work on refresh.
- If backend is on another domain, ensure backend CORS allows your Vercel frontend domain.
- Replit-only config/plugins were removed.
