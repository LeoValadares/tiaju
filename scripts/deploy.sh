#!/usr/bin/env bash
# Publica src/ no S3 e invalida o cache do CloudFront.
#
#   S3_BUCKET=meu-bucket CLOUDFRONT_ID=E123ABC npm run deploy
#
# Assets versionados ganham cache longo; o HTML fica sempre fresco para que
# uma nova publicacao apareca imediatamente.
set -euo pipefail

: "${S3_BUCKET:?defina S3_BUCKET (ex.: S3_BUCKET=tiaju10-site)}"

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src"

echo "==> Enviando assets para s3://$S3_BUCKET"
aws s3 sync "$SRC" "s3://$S3_BUCKET" \
  --delete \
  --exclude "*.html" \
  --cache-control "public, max-age=31536000, immutable"

echo "==> Enviando HTML para s3://$S3_BUCKET"
aws s3 sync "$SRC" "s3://$S3_BUCKET" \
  --delete \
  --exclude "*" --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html; charset=utf-8"

if [[ -n "${CLOUDFRONT_ID:-}" ]]; then
  echo "==> Invalidando CloudFront $CLOUDFRONT_ID"
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_ID" \
    --paths "/*" >/dev/null
fi

echo "==> Pronto."
