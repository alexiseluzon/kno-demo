# Knō Demo

A demo learning marketplace where signed-in users post and manage learning sessions in real time.

**Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Convex, Clerk, Sonner.

## Features
- Clerk authentication (sign in/out)
- Real-time session board (Convex)
- Server-side validation, ownership checks, and per-user rate limiting
- Confirm dialogs, toasts, inline field validation
- Accessible (skip link, labels, focus states, ARIA) and SEO-ready (metadata, JSON-LD, sitemap, robots)

## Setup
```powershell
npm install
copy .env.example .env.local   # fill in values
npx convex dev                 # terminal 1
npm run dev                    # terminal 2
```

Environment variables: see `.env.example`. Also set `CLERK_JWT_ISSUER_DOMAIN` in the Convex dashboard.
Optional: `NEXT_PUBLIC_SITE_URL` (your deployed URL, used for SEO).

## Scripts
| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js |
| `npm test` | Jest unit tests |
| `npm run test:int` | Convex integration tests (Vitest) |
| `npm run test:e2e` | Playwright E2E |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Security
Input validation and sanitization on the server, auth required for writes, owner-only deletes, per-user rate limiting, no secrets in the repo.

## License and disclaimer
MIT, see [LICENSE](LICENSE). &copy; 2026 Alexis Luzon.
This is a portfolio demo provided "as is" without warranty. The author is not liable for any damages arising from its use.