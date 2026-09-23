#!/usr/bin/env bash
#
# Deploy the Dialora website to its EC2 box. Idempotent: rsync the working tree,
# install, build, restart the service.
#
#   ./deploy.sh
#
# Host and key come from the environment so nothing sensitive is committed:
#
#   export DIALORA_HOST=ec2-user@<new-ec2-ip>
#   export DIALORA_KEY=path/to/key.pem
#   export DIALORA_URL=https://<public-url>
#
# .env is deliberately NOT synced — it holds the Bolna key and lives only on
# the box, re-chmodded to 600 on arrival. It is git-ignored, so it never enters
# a commit; nothing here writes the key to a log.
set -euo pipefail

HOST="${DIALORA_HOST:-}"
KEY="${DIALORA_KEY:-}"
URL="${DIALORA_URL:-}"
APP_DIR="${DIALORA_APP_DIR:-/opt/dialora-site}"

[[ -n "$HOST" ]] || { echo "Set DIALORA_HOST, e.g. ec2-user@1.2.3.4" >&2; exit 1; }
[[ -n "$KEY"  ]] || { echo "Set DIALORA_KEY, e.g. ./dialora.pem" >&2; exit 1; }
[[ -f "$KEY"  ]] || { echo "Missing SSH key: $KEY" >&2; exit 1; }

cd "$(dirname "$0")"
chmod 400 "$KEY"

SSH=(ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST")

echo "==> Checking locally before shipping"
npm run build            # tsc -b && vite build
npm run test:smoke       # exercises /api/demo-call with Bolna stubbed

echo "==> Syncing source to $HOST:$APP_DIR"
# .env is deliberately NOT synced: it holds the Bolna and voice-demo keys and
# lives only on the box. Syncing it would mean a missing/blank local copy could
# silently wipe or overwrite the real credentials via --delete.
#
# The extra flags are not cosmetic. Without them this sync reliably dies partway
# through from macOS with:
#   ssh_packet_write_poll: Result too large / unexpected end of file
# because the tree carries ~16MB of hero frames and video. The deploy aborts
# safely (the old build keeps serving) but looks like a real failure, so it used
# to need a manual retry every time.
#   --partial          keep what already transferred, so a retry resumes
#   --timeout          fail a genuinely stalled transfer instead of hanging
#   --bwlimit          stops the local uplink being saturated, which is what
#                      triggers the write-poll error in the first place
#   ServerAlive*       keeps the SSH channel alive through slow stretches
#   IPQoS=throughput   avoids the interactive QoS marking some paths throttle
rsync -az --delete --partial --timeout=180 --bwlimit=8000 \
  --exclude node_modules --exclude .git --exclude dist \
  --exclude '.env' --exclude '*.pem' --exclude '.DS_Store' --exclude '*.tsbuildinfo' \
  -e "ssh -i $KEY -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=8 -o IPQoS=throughput" \
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
# GitHub Pages build which lives under /DialoraUserWebsite/.
BASE_PATH=/ npm run build 2>&1 | tail -5
sudo systemctl restart dialora-site
sleep 3
systemctl is-active dialora-site
REMOTE

if [[ -n "$URL" ]]; then
  echo "==> Smoke test"
  for path in / /api/health /api/voice/health; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$URL$path")
    printf '  %-20s %s\n' "$path" "$code"
    [[ "$code" == "200" ]] || { echo "FAILED: $path returned $code" >&2; exit 1; }
  done

  health=$(curl -s "$URL/api/health")
  # Confirms the box actually has the Bolna credentials, without printing them.
  grep -q '"bolnaConfigured":true' <<<"$health" \
    || { echo "FAILED: server is up but Bolna is not configured" >&2; exit 1; }
  # If this reads 127.0.0.1 from out here, `trust proxy` is wrong and every
  # visitor shares one rate-limit bucket.
  grep -q '"clientIp":"127.0.0.1"' <<<"$health" \
    && { echo "FAILED: /api/health reports clientIp 127.0.0.1 — reverse proxy is not passing X-Forwarded-For" >&2; exit 1; }

  # The voice demo needs credentials that live only in .env on the box, and this
  # script deliberately never syncs .env. A warning rather than a failure: the
  # site is fine without the demo, and failing here would block an otherwise
  # good deploy.
  voice=$(curl -s "$URL/api/voice/health")
  if grep -q '"configured":true' <<<"$voice"; then
    provider=$(sed -n 's/.*"active":"\([a-z]*\)".*/\1/p' <<<"$voice")
    echo "  voice demo:          configured (tts=${provider:-unknown})"
  else
    echo "  voice demo:          NOT CONFIGURED" >&2
    echo "     Add DEEPGRAM_API_KEY, SARVAM_API_KEY, AWS_ACCESS_KEY_ID," >&2
    echo "     AWS_SECRET_ACCESS_KEY, AWS_REGION and the POLLY_*/VOICE_* settings" >&2
    echo "     to $APP_DIR/.env on the box, then: sudo systemctl restart dialora-site" >&2
  fi

  echo "==> Live at $URL"
fi
