#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_HOST="${DEPLOY_HOST:-193.246.144.28}"
DEPLOY_USER="${DEPLOY_USER:-$USER}"
DEPLOY_PATH="${DEPLOY_PATH:-~/sbertrack-platform}"
DEPLOY_BATCH_MODE="${DEPLOY_BATCH_MODE:-no}"
BACKEND_PORT="${BACKEND_PORT:-8080}"
FRONTEND_PORT="${FRONTEND_PORT:-80}"

SSH_TARGET="${DEPLOY_USER}@${DEPLOY_HOST}"
SSH_OPTS=(
  -o "BatchMode=${DEPLOY_BATCH_MODE}"
  -o "StrictHostKeyChecking=accept-new"
  -o "ConnectTimeout=20"
)

if [[ -n "${SSH_KEY_PATH:-}" ]]; then
  SSH_OPTS+=(-i "$SSH_KEY_PATH")
fi

cd "$ROOT_DIR"

./gradlew :backend:build --no-daemon --no-watch-fs
(cd frontend && npm run build)
docker compose build

ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "mkdir -p $DEPLOY_PATH"

rsync -az --delete \
  -e "ssh ${SSH_OPTS[*]}" \
  --exclude '.idea/' \
  --exclude '.gradle/' \
  --exclude 'backend/build/' \
  --exclude 'frontend/dist/' \
  --exclude 'frontend/node_modules/' \
  --exclude '.DS_Store' \
  "$ROOT_DIR/" "$SSH_TARGET:$DEPLOY_PATH/"

ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "cd $DEPLOY_PATH && docker compose down --remove-orphans || true"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "cd $DEPLOY_PATH && BACKEND_PORT=$BACKEND_PORT FRONTEND_PORT=$FRONTEND_PORT docker compose up -d --build && BACKEND_PORT=$BACKEND_PORT FRONTEND_PORT=$FRONTEND_PORT docker compose ps"
