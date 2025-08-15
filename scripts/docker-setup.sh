#!/bin/bash

# Script para setup inicial de la aplicación con Docker

echo "🐳 Iniciando setup de Asistente RRHH API con Docker"
echo "=================================================="

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instálalo primero."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env desde .env.example"
    cp .env.example .env
fi

# Parar servicios si están corriendo
echo "🛑 Parando servicios existentes..."
docker-compose down -v

# Construir e iniciar servicios
echo "🔨 Construyendo y iniciando servicios..."
docker-compose up -d --build

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando que PostgreSQL esté listo..."
sleep 10

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose ps

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
docker-compose exec api yarn mg:run

# Ejecutar seeds (si existen)
echo "🌱 Ejecutando seeds..."
docker-compose exec api yarn seed:run 2>/dev/null || echo "ℹ️ No hay seeds configurados"

echo ""
echo "✅ Setup completado!"
echo "📌 La API está disponible en: http://localhost:3005"
echo "📌 PostgreSQL está disponible en: localhost:5432"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f api"
echo "  - Parar servicios: docker-compose down"
echo "  - Reiniciar API: docker-compose restart api"
echo "" 