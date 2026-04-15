#!/usr/bin/env bash
set -a
source .env
set +a

push() {
  local name="$1" value="$2" env="$3"
  vercel env rm "$name" "$env" --yes 2>/dev/null
  if vercel env add "$name" "$env" --value "$value" --yes 2>&1 | grep -q "Added"; then
    echo "  ✓ $name -> $env"
  else
    echo "  ✗ $name -> $env (FAILED)"
  fi
}

for v in DATABASE_URL DATABASE_URL_UNPOOLED ADMIN_PASSWORD SESSION_SECRET NEXT_PUBLIC_SITE_URL BLOB_READ_WRITE_TOKEN; do
  for env in production preview development; do
    push "$v" "${!v}" "$env"
  done
done

echo ""
vercel env ls
