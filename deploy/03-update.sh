#!/bin/bash
# ============================================
# PVREZA Club — Actualizar tras cambios
# Ejecutar como: bash 03-update.sh TU_IP_PUBLICA
# ============================================

set -e

SERVER_IP=${1:?"Uso: bash 03-update.sh TU_IP_PUBLICA"}
APP_DIR="/home/ubuntu/pvreza"

echo ">>> Actualizando PVREZA Club..."

cd "$APP_DIR"
git pull

echo ">>> Actualizando backend..."
cd "$APP_DIR/backend"
npm install --production
sudo systemctl restart pvreza-backend

echo ">>> Reconstruyendo frontend..."
cd "$APP_DIR/frontend"
npm install
VITE_BACKEND_URL="http://$SERVER_IP" npm run build

echo ""
echo "============================================"
echo "  Actualización completada!"
echo "  Web: http://$SERVER_IP"
echo "============================================"
