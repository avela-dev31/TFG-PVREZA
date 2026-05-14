#!/bin/bash
# ============================================
# PVREZA Club — Despliegue de la aplicación
# Ejecutar como: bash 02-deploy-app.sh TU_IP_PUBLICA
# ============================================

set -e

SERVER_IP=${1:?"Uso: bash 02-deploy-app.sh TU_IP_PUBLICA"}
APP_DIR="/home/ubuntu/pvreza"

echo ">>> Desplegando PVREZA Club en $SERVER_IP..."

# ============================================
# 1. Clonar o actualizar el repositorio
# ============================================
if [ -d "$APP_DIR" ]; then
  echo ">>> Actualizando repositorio..."
  cd "$APP_DIR"
  git pull
else
  echo ">>> Clonando repositorio..."
  git clone https://github.com/AntonioLuis3181/TFG-PVREZA.git "$APP_DIR"
  cd "$APP_DIR"
fi

# ============================================
# 2. Backend — instalar dependencias y configurar
# ============================================
echo ">>> Configurando backend..."
cd "$APP_DIR/backend"
npm install --production

cat > .env.production <<EOF
PMA_HOST=127.0.0.1
MYSQL_USER=pvreza_user
MYSQL_PASSWORD=PvrezaClub2024!
MYSQL_DATABASE=pvreza_db
MYSQL_PORT=3306
PORT=3000
NODE_ENV=production
FRONTEND_URL=http://$SERVER_IP
JWT_SECRET=$(openssl rand -hex 32)
EOF

echo ">>> .env.production creado"

# ============================================
# 3. Base de datos — crear usuario y cargar schema
# ============================================
echo ">>> Configurando MySQL..."
sudo mysql <<SQLEOF
CREATE DATABASE IF NOT EXISTS pvreza_db;
CREATE USER IF NOT EXISTS 'pvreza_user'@'localhost' IDENTIFIED BY 'PvrezaClub2024!';
GRANT ALL PRIVILEGES ON pvreza_db.* TO 'pvreza_user'@'localhost';
FLUSH PRIVILEGES;
SQLEOF

echo ">>> Cargando esquema de base de datos..."
sudo mysql pvreza_db < "$APP_DIR/backend/database/pvreza_db.sql" || echo "(Schema ya existente o con datos)"

# ============================================
# 4. Frontend — build de producción
# ============================================
echo ">>> Construyendo frontend..."
cd "$APP_DIR/frontend"
npm install

VITE_BACKEND_URL="http://$SERVER_IP" npm run build

echo ">>> Frontend compilado en dist/"

# ============================================
# 5. Nginx — configurar como reverse proxy
# ============================================
echo ">>> Configurando Nginx..."
sudo tee /etc/nginx/sites-available/pvreza > /dev/null <<NGINXEOF
server {
    listen 80;
    server_name $SERVER_IP;

    # Frontend — archivos estáticos de React
    root $APP_DIR/frontend/dist;
    index index.html;

    # SPA fallback — todas las rutas al index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API — proxy al backend Express
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Uploads — imágenes de productos
    location /uploads/ {
        proxy_pass http://127.0.0.1:3000/uploads/;
    }
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/pvreza /etc/nginx/sites-enabled/pvreza
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo ">>> Nginx configurado"

# ============================================
# 6. Servicio systemd — backend como servicio
# ============================================
echo ">>> Creando servicio para el backend..."
sudo tee /etc/systemd/system/pvreza-backend.service > /dev/null <<SVCEOF
[Unit]
Description=PVREZA Club Backend
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$APP_DIR/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
SVCEOF

sudo systemctl daemon-reload
sudo systemctl enable pvreza-backend
sudo systemctl restart pvreza-backend

echo ""
echo "============================================"
echo "  PVREZA Club desplegado correctamente!"
echo ""
echo "  Web:     http://$SERVER_IP"
echo "  Backend: http://$SERVER_IP/api/"
echo ""
echo "  Comandos útiles:"
echo "    sudo systemctl status pvreza-backend"
echo "    sudo journalctl -u pvreza-backend -f"
echo "    sudo systemctl restart pvreza-backend"
echo "============================================"
