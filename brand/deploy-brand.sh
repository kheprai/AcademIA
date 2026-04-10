#!/bin/bash
# Sync brand kit to the public web directory served by Caddy
# Usage: ./deploy-brand.sh
# URL: https://brand.cursosacademia.ar/

set -e

SRC="/root/projects/client-academia/brand/"
DEST="/var/www/brand/"

echo "Syncing brand kit to $DEST..."
rsync -a --delete "$SRC" "$DEST"
chown -R caddy:caddy "$DEST"

echo "Done. Live at:"
echo "  Manual:  https://brand.cursosacademia.ar/manual/AcademIA-Brand-Manual.html"
echo "  Gallery: https://brand.cursosacademia.ar/gallery.html"
echo "  Assets:  https://brand.cursosacademia.ar/assets/"
