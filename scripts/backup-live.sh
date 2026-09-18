#!/usr/bin/env bash
# $0 live DB backup ritual (see docs/live-migrate.md).
# Usage: ./scripts/backup-live.sh
# Requires DIRECT_URL in environment (quoted — URL contains ?/&).
set -euo pipefail

if [ -z "${DIRECT_URL:-}" ]; then
  echo "DIRECT_URL is missing. Export it first (never commit it)." >&2
  exit 1
fi

OUT="live-backup-$(date +%F).dump"
pg_dump "$DIRECT_URL" -Fc -f "$OUT"
echo "Wrote $OUT — keep last 4 dumps."
