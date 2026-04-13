#!/usr/bin/env bash
# Cloudflare tunnel — tactileterrain.maximinimal.ca → localhost:5650
set -euo pipefail

TUNNEL_TOKEN="eyJhIjoiOWU4MmQzYzkwODFiNTAwOWU5YjZmNGQ3ZWI4ZjE1YjYiLCJ0IjoiNzczYjlkN2YtMzczMS00NmQ5LTliYTMtNDkxNjc3NDQ0YzAwIiwicyI6Ik5XSTFPVEZoWW1NdE9EWm1NaTAwWVdVNExXSmxNR1l0WVRNME5qZ3dOalJsTkdKbCJ9"

if ! command -v cloudflared &>/dev/null; then
  echo "ERROR: cloudflared not found. Install from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/" >&2
  exit 1
fi

echo "Starting Cloudflare tunnel → tactileterrain.maximinimal.ca"
exec cloudflared tunnel --no-autoupdate run --token "$TUNNEL_TOKEN"
