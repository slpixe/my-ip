# AGENTS.md

## Project

`my-ip` is a Next.js app deployed to Cloudflare Workers through OpenNext. It
shows the visitor's public IP, optionally enriches it through external
providers, and stores settings/history in browser local storage.

## Development commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm exec tsc --noEmit
pnpm build
pnpm storybook
pnpm build-storybook
pnpm preview
```

Run `pnpm deploy` only when deployment is explicitly requested. `pnpm test`
runs the Storybook stories through Vitest in a Playwright Chromium browser;
install Chromium first with `pnpm exec playwright install chromium`.

## Architecture

- `src/app/api/ip/route.ts` is the only public API route.
- `src/app/api/ip/clientIp.ts` validates platform-provided client IP metadata.
- `src/app/api/ip/rateLimit.ts` uses the Cloudflare `WAN_IP_RATE_LIMITER`
  binding when deployed there and an in-memory fallback elsewhere.
- Provider adapters live in `src/app/api/ip/providers/` and return normalized
  fields.
- React state is composed in `src/contexts/`, with reusable behavior in
  `src/hooks/`.
- History is persisted through `src/utils/historyStorage.ts`.

## Security and privacy rules

- Trust client IP headers only when the request is known to come through the
  configured platform proxy. Vercel is selected only by its deployment
  environment; Cloudflare is selected from OpenNext's `request.cf` metadata.
  Do not use client-supplied headers to select a trust path.
- Keep provider URLs fixed and encode the IP path segment; do not turn the API
  into an arbitrary server-side fetch proxy.
- Do not expose provider-specific raw responses or server environment values to
  the browser.
- Keep secrets server-side. Use `.env.local` for local values and never commit
  `.env*` files other than `.env.example`.
- Remember that IP addresses are personal data in many jurisdictions. Avoid
  adding server-side IP persistence or logging without documenting it.
- Preserve private/no-store cache headers on per-visitor API responses.

## Change guidance

- Prefer small, typed changes and keep the public response shape stable.
- If changing a provider, update its adapter, README provider notes, timeout or
  rate-limit documentation, and relevant example payload.
- If changing deployment configuration, update `wrangler.json`,
  `CLOUDFLARE_DEPLOYMENT.md`, and the workflow together.
- Before handing off code, run lint, tests, TypeScript, the production build,
  and the Storybook build.
