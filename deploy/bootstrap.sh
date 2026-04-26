#!/usr/bin/env bash
# Run once on a fresh server, from inside /opt/mvst/mvst.ru/deploy
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CRM_DIR="$REPO_ROOT/mvst-crm"
# CRM lives in the same dnikolay95/mvst repo on an unrelated `crm` branch.
# Override either via env (CRM_REPO=... CRM_BRANCH=... ./bootstrap.sh).
CRM_REPO="${CRM_REPO:-git@github.com:dnikolay95/mvst.git}"
CRM_BRANCH="${CRM_BRANCH:-crm}"

if [ ! -d "$CRM_DIR/.git" ]; then
  echo "[bootstrap] cloning $CRM_REPO ($CRM_BRANCH) into $CRM_DIR"
  git clone -b "$CRM_BRANCH" "$CRM_REPO" "$CRM_DIR"
else
  echo "[bootstrap] mvst-crm already present, pulling latest"
  git -C "$CRM_DIR" pull --ff-only
fi

cd "$(dirname "$0")"
for f in .env site.env crm.env; do
  if [ ! -f "$f" ]; then
    cp "${f}.example" "$f"
    echo "[bootstrap] created $f from example — EDIT BEFORE STARTING"
  fi
done

echo
echo "[bootstrap] done. Next steps:"
echo "  1) edit deploy/.env, deploy/site.env, deploy/crm.env"
echo "  2) (first run only) set RUN_SEED=true in crm.env"
echo "  3) docker compose up -d --build"
echo "  4) revert RUN_SEED=false and: docker compose up -d"
