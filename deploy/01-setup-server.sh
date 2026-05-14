#!/bin/bash
# ============================================
# PVREZA Club — Setup del servidor EC2
# Ejecutar como: sudo bash 01-setup-server.sh
# ============================================

set -e

echo ">>> Actualizando sistema..."
apt update && apt upgrade -y

echo ">>> Instalando Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo ">>> Instalando MySQL 8..."
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

echo ">>> Instalando Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

echo ">>> Instalando Git..."
apt install -y git

echo ">>> Verificando versiones..."
node -v
npm -v
mysql --version
nginx -v

echo ""
echo "============================================"
echo "  Servidor listo. Ahora ejecuta:"
echo "  sudo mysql_secure_installation"
echo "  Y luego: bash 02-deploy-app.sh TU_IP_PUBLICA"
echo "============================================"
