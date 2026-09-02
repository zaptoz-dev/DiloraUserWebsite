# Dialora website

Marketing site for Dialora, plus the live **demo-call** integration: a visitor
fills in the form on `/demo` and Dialora rings their phone through
[Bolna](https://bolna.ai).

- **Frontend** — Vite + React 18 + TypeScript + Tailwind v4, routed with
  `HashRouter` (`src/`).
- **Server** — a small Express app (`server/`) that serves the built SPA out of
  `dist/` *and* exposes `POST /api/demo-call`.

## Why there is a server

The Bolna API key must never reach the browser. It authorises placing calls, so
anything shipped in the JS bundle — which is public, and in a public repo — can
be read and used by anyone to spend the account's balance. So the browser only
ever calls our own `/api/demo-call`, and only the server talks to
`api.bolna.ai`. This mirrors the arrangement in the TSI Stock Brokers dashboard,
which this integration was ported from.

Site and API share an origin, so the frontend uses a relative path and there is
no CORS to configure.

## Local development

```bash
npm install
cp .env.example .env      # fill in BOLNA_API_KEY and BOLNA_AGENT_ID
npm run dev:api           # API on :3000
npm run dev               # site on :5173, proxying /api to :3000
```

`npm run test:smoke` exercises the whole `/api/demo-call` path — validation,
rate limiting, payload shape, static serving — with Bolna stubbed out, so it
never places (or pays for) a real call.

## The demo-call endpoint

`POST /api/demo-call` with `{name, company, countryCode, phone, email, intent,
notes}`. The server normalises the number to E.164, applies the rate limits,
then calls Bolna's `POST /call` with `agent_id` and `recipient_phone_number`.
Form fields are passed through as `user_data`, which the agent's prompt reads as
`{first_name}`, `{full_name}`, `{company_name}`, `{email}`, `{intent}`,
`{notes}` — these keys must match the placeholders configured on the Bolna
agent.

Success returns `{executionId, status, message}`. On failure the visitor sees a
generic message while Bolna's real complaint goes to the server log, since it
can name the agent id or account state.

`GET /api/health` reports whether credentials are present, without echoing them.

### Rate limiting

The endpoint is public and dials whatever number a stranger types, so it is
limited on three axes at once (per IP, per number, and globally per day) — see
`DEMO_MAX_*` in `.env.example`. Allowance is only consumed once a call is
actually placed, so a Bolna failure doesn't burn a visitor's quota.

Counters are in-memory: they reset on restart and are per-process, which suits
the single systemd service. Move them to Redis if this ever runs more than one
instance.

## Deployment

Deployed to EC2 as a systemd service behind Caddy:

```bash
export DIALORA_HOST=ec2-user@<ip>
export DIALORA_KEY=./<key>.pem
export DIALORA_URL=https://<public-url>
./deploy.sh
```

`deploy/dialora-site.service` and `deploy/Caddyfile` are the box-side config.
Caddy must set `X-Forwarded-For` (it does by default) — the server trusts one
proxy hop so the per-IP limit sees real visitor addresses rather than
`127.0.0.1`.

### The GitHub Pages build

`vite.config.ts` takes its `base` from `BASE_PATH`, defaulting to
`/DialoraUserWebsite/` for GitHub Pages; the server build uses `BASE_PATH=/`.

Note that GitHub Pages is static and has no `/api/demo-call`, so the demo form
cannot work there. Either retire the Pages deployment in favour of the server,
or build Pages with `VITE_API_BASE_URL=https://<api-host>` and add that Pages
origin to `DEMO_CORS_ORIGINS` on the server.
