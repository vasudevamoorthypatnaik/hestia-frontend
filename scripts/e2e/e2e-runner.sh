#!/usr/bin/env bash
# Minimal local E2E runner (HES-SETUP). Runs the Playwright web suite against a served build.
# Requires: hestia-backend reachable at E2E_API_URL (default :8082) and the app served at BASE_URL.
set -euo pipefail
export BASE_URL="${BASE_URL:-http://localhost:8091}"
export E2E_API_URL="${E2E_API_URL:-http://localhost:8082/graphql}"
echo "E2E: BASE_URL=$BASE_URL  API=$E2E_API_URL"
npx playwright test --project=web "$@"
