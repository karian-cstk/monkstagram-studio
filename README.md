# Monkstagram Studio

Contentstack design's public ledger, UI Kit, and changelog — plus an
internal, Google-Workspace-gated governance portal with an AI Design
Consultant.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

## Required environment variables

| Variable | Where to get it |
|---|---|
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your deployed URL (or `http://localhost:3000` locally) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client ID. Add `{NEXTAUTH_URL}/api/auth/callback/google` as an authorized redirect URI. |
| `ALLOWED_EMAIL_DOMAIN` | Defaults to `contentstack.com` — only accounts on this domain can sign in to `/internal`. |
| `ANTHROPIC_API_KEY` | An Anthropic API key, used server-side only by `/api/consultant`. |

## Deploying on Contentstack Launch

1. Push this repo to the `main` branch.
2. In Launch, select this repo + `main` branch, framework preset **Next.js**.
3. Add the environment variables above in Launch's project settings before
   the first deploy (build will succeed without them, but sign-in and the
   AI consultant won't work until they're set).

## Structure

- `app/page.tsx`, `app/ui-kit`, `app/changelog` — public site
- `app/internal/*` — gated designer portal (NextAuth + Google SSO)
- `app/api/consultant/route.ts` — server-side Claude API call for the AI
  Design Consultant (never exposes the API key to the browser)
- `content/*.ts` — static content for now; swap for Contentstack CMS fetches
  later without changing page structure

## Roadmap

- [ ] Migrate `content/*.ts` to Contentstack CMS entries
- [ ] Add roles (e.g. design-systems architect vs. general designer)
- [ ] Ledger submission flow so any designer can propose a new entry
