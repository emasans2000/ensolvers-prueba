#!/bin/bash
# Deploy noteapp local!
# Este script configura y arranca tanto el backend como el frontend de la aplicación.

# Validación del entorno
if [[ "$OSTYPE" != "linux-gnu"* && "$OSTYPE" != "darwin"* && "$OSTYPE" != "msys"* && "$OSTYPE" != "cygwin"* ]]; then
  echo "❌ Este script está diseñado para Linux/macOS o entornos similares (como Git Bash en Windows)."
  exit 1
fi

# Solicitar credenciales al usuario
read -p "Ingrese el usuario de la base de datos PostgreSQL: " POSTGRES_USER
read -s -p "Ingrese la contraseña de la base de datos: " DB_PASSWORD
echo ""

# Verificar si jq está instalado
#if ! command -v jq &> /dev/null; then
  #  echo "❌ jq no está instalado. Instálalo con: sudo apt install jq"
 #   exit 1
#fi

# Definir parámetros de conexión
DB_NAME="noteapp_local"
DB_SERVER="localhost"

# Construir la nueva cadena de conexión
NEW_CONNECTION_STRING="Server=$DB_SERVER;Database=$DB_NAME;User Id=$POSTGRES_USER;Password=$DB_PASSWORD;"

# Modificar el archivo appsettings.json con jq
cd backend || { echo "❌ No se pudo acceder al directorio backend."; exit 1; }

jq --arg conn "$NEW_CONNECTION_STRING" '.ConnectionStrings.DefaultConnection = $conn' appsettings.json > tmp.json && mv tmp.json appsettings.json

cd ..

echo "✅ Se ha actualizado la cadena de conexión en appsettings.json"

# Función para crear la base de datos en PostgreSQL
create_local_db() {
  local database=$1
  echo "🔧 Creando base de datos PostgreSQL local: $database"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    DO \$\$ 
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database') THEN
        CREATE DATABASE $database;
      END IF;
    END
    \$\$;
EOSQL
}

# Definir entorno
ENVIRONMENT="Production"

# Directorios de backend y frontend
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

echo "🚀 Iniciando configuración e inicio de la aplicación..."

# --- Backend ---
echo "📂 Accediendo al backend: $BACKEND_DIR"
cd "$BACKEND_DIR" || { echo "❌ No se pudo acceder al backend."; exit 1; }

# Crear base de datos si no existe
create_local_db "$DB_NAME"

# Aplicar migraciones
echo "🔄 Aplicando migraciones..."
dotnet ef database update
if [ $? -ne 0 ]; then
  echo "❌ Error al actualizar la base de datos."
  exit 1
fi

# Iniciar backend en segundo plano
echo "🚀 Iniciando el backend..."
dotnet run &
BACKEND_PID=$!

# --- Frontend ---
echo "📂 Accediendo al frontend: $FRONTEND_DIR"
cd "../$FRONTEND_DIR" || { echo "❌ No se pudo acceder al frontend."; exit 1; }

# Instalar dependencias
echo "📦 Instalando dependencias del frontend..."
npm install
if [ $? -ne 0 ]; then
  echo "❌ Error al instalar las dependencias del frontend."
  exit 1
fi

# Construir e iniciar el frontend
echo "🛠️ Construyendo frontend..."
npm run build
echo "🚀 Iniciando frontend..."
npm start &
FRONTEND_PID=$!

echo "✅ La aplicación se ha iniciado correctamente."
echo "🔹 Backend PID: $BACKEND_PID"
echo "🔹 Frontend PID: $FRONTEND_PID"

# Esperar a que terminen ambos procesos
wait $BACKEND_PID $FRONTEND_PID
