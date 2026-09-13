#!/usr/bin/env bash
#
# Pre-release verification for the production build.
#
# Runs, in order, and stops at the first failure:
#   1. Node.js major version matches .nvmrc
#   2. the working tree is clean (so the build matches the commit)
#   3. npm ci
#   4. lint without auto-fix (plain `vue-cli-service lint` rewrites files)
#   5. production build
#   6. the build did not modify tracked files
#   7. npm audit --omit=dev, checked against script/audit-allowlist.json
#
# Usage: script/verify-release.sh [--allow-dirty]
#
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

allow_dirty=false
for arg in "$@"; do
  case "$arg" in
    --allow-dirty) allow_dirty=true ;;
    -h|--help)
      sed -n '3,15p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "unknown option: $arg" >&2
      exit 2
      ;;
  esac
done

step() { printf '\n==> %s\n' "$*"; }
fail() { printf '\nFAIL: %s\n' "$*" >&2; exit 1; }

step "Toolchain"
required_major="$(cut -d. -f1 < .nvmrc | tr -dc '0-9')"
node_version="$(node --version)"
node_major="$(node -p 'process.versions.node.split(".")[0]')"
npm_version="$(npm --version)"
echo "node $node_version, npm $npm_version (required: Node $required_major)"
[ "$node_major" = "$required_major" ] \
  || fail "Node $required_major is required, found $node_version. Run 'nvm use' in the repository root."

step "Working tree"
commit="$(git rev-parse HEAD)"
tree_before="$(git status --porcelain)"
echo "commit $commit"
if [ -n "$tree_before" ]; then
  echo "$tree_before"
  $allow_dirty || fail "working tree has uncommitted changes; commit or stash them, or pass --allow-dirty for a local check"
  echo "continuing with a dirty working tree (--allow-dirty); do not release this build"
fi

step "npm ci"
npm ci || fail "npm ci"

step "Lint (no auto-fix)"
npm run lint -- --no-fix || fail "lint"

step "Production build"
NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--openssl-legacy-provider" npm run build || fail "production build"
[ -f dist/index.html ] || fail "dist/index.html was not produced"

step "Working tree after build"
tree_after="$(git status --porcelain)"
[ "$tree_after" = "$tree_before" ] || {
  echo "$tree_after"
  fail "lint or build changed tracked files"
}
echo "unchanged"

step "Production dependency audit"
audit_json="$(mktemp)"
trap 'rm -f "$audit_json"' EXIT
# npm audit exits non-zero whenever it reports anything; the allowlist check decides.
npm audit --omit=dev --json > "$audit_json" || true
audit_summary="$(node script/check-audit.js "$audit_json" script/audit-allowlist.json)" || {
  echo "$audit_summary"
  fail "production dependency audit"
}
echo "$audit_summary"

step "Summary"
echo "commit  $commit"
echo "node    $node_version / npm $npm_version"
echo "npm ci  ok"
echo "lint    ok (--no-fix)"
echo "build   ok (dist/index.html)"
echo "audit   $(echo "$audit_summary" | tail -n 1)"
