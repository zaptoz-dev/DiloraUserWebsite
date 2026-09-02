#!/usr/bin/env bash
#
# Deploy the Dilora website to its EC2 box. Idempotent: rsync the working tree,
# install, build, restart the service.
#
#   ./deploy.sh
#
# Host and key come from the environment so nothing sensitive is committed:
#
#   export DILORA_HOST=ec2-user@<new-ec2-ip>
#   export DILORA_KEY=path/to/key.pem
#   export DILORA_URL=https://<public-url>
#
# .env is synced deliberately (the box has no other source of the Bolna key)
# and re-chmodded to 600 on arrival. It is git-ignored, so it never enters a
# commit; nothing here writes the key to a log.
set -euo pipefail

HOST="${DILORA_HOST:-}"
KEY="${DILORA_KEY:-}"
URL="${DILORA_URL:-}"
APP_DIR="${DILORA_APP_DIR:-/opt/dilora-site}"

[[ -n "$HOST" ]] || { echo "Set DILORA_HOST, e.g. ec2-user@1.2.3.4" >&2; exit 1; }
[[ -n "$KEY"  ]] || { echo "Set DILORA_KEY, e.g. ./dilora.pem" >&2; exit 1; }
[[ -f "$KEY"  ]] || { echo "Missing SSH key: $KEY" >&2; exit 1; }

cd "$(dirname "$0")"
chmod 400 "$KEY"

SSH=(ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST")

echo "==> Checking locally before shipping"
npm run build            # tsc -b && vite build
npm run test:smoke       # exercises /api/demo-call with Bolna stubbed

echo "==> Syncing source to $HOST:$APP_DIR"
# .env is deliberately NOT synced: it holds the Bolna key and lives only on
# the box. Syncing it would mean a missing/blank local copy could silently wipe
# or overwrite the real credentials via --delete.
rsync -az --delete \
  --exclude node_modules --exclude .git --exclude dist \
  --exclude '.env' --exclude '*.pem' --exclude '.DS_Store' --exclude '*.tsbuildinfo' \
  -e "ssh -i $KEY -o StrictHostKeyChecking=no" \
  ./ "$HOST:$APP_DIR/"

echo "==> Installing, building, restarting"
"${SSH[@]}" APP_DIR="$APP_DIR" bash -euo pipefail <<'REMOTE'
cd "$APP_DIR"
[[ -f .env ]] || { echo "No .env on the server — create it from .env.example." >&2; exit 1; }
chmod 600 .env
# `npm install`, not `npm ci`: the lockfile records @emnapi/core and
# @emnapi/runtime only as bundled deps of @tailwindcss/oxide-wasm32-wasi, which
# macOS never installs, so a mac-generated lock makes `npm ci` fail on
# linux-arm64. Regenerating the lock with --os/--cpu does not fix it (npm bug
# with bundled optional deps), so we let install resolve the platform extras.
npm install --no-audit --no-fund --silent
# BASE_PATH=/ because this server hosts the site at the root, unlike the
# GitHub Pages build which lives under /DiloraUserWebsite/.
BASE_PATH=/ npm run build 2>&1 | tail -5
sudo systemctl restart dilora-site
sleep 3
systemctl is-active dilora-site
REMOTE

if [[ -n "$URL" ]]; then
  echo "==> Smoke test"
  for path in / /api/health; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$URL$path")
    printf '  %-16s %s\n' "$path" "$code"
    [[ "$code" == "200" ]] || { echo "FAILED: $path returned $code" >&2; exit 1; }
  done
  # Confirms the box actually has the Bolna credentials, without printing them.
  curl -s "$URL/api/health" | grep -q '"bolnaConfigured":true' \
    || { echo "FAILED: server is up but Bolna is not configured" >&2; exit 1; }
  echo "==> Live at $URL"
fi
