#!/usr/bin/env bash
set -e
set -a
source .env
set +a

push() {
  local name="$1" value="$2"
  for env in production preview development; do
    vercel env rm "$name" "$env" --yes >/dev/null 2>&1 || true
    vercel env add "$name" "$env" --value "$value" --yes >/dev/null 2>&1
    echo "  ✓ $name -> $env"
  done
}

push DATABASE_URL "$DATABASE_URL"
push DATABASE_URL_UNPOOLED "$DATABASE_URL_UNPOOLED"
push ADMIN_PASSWORD "$ADMIN_PASSWORD"
push SESSION_SECRET "$SESSION_SECRET"
push NEXT_PUBLIC_SITE_URL "$NEXT_PUBLIC_SITE_URL"
push BLOB_READ_WRITE_TOKEN "$BLOB_READ_WRITE_TOKEN"

echo ""
echo "Env vars pushed. Current list:"
vercel env ls
