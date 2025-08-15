#!/bin/bash

# Script para desarrollo con Docker (hot reload)

echo "🚀 Iniciando entorno de desarrollo con Docker"
echo "=============================================="

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instálalo primero."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env desde .env.example"
    cp .env.example .env
fi

# Parar servicios si están corriendo
echo "🛑 Parando servicios existentes..."
docker-compose -f docker-compose.dev.yml down

# Iniciar servicios en modo desarrollo
echo "🔨 Iniciando servicios en modo desarrollo..."
docker-compose -f docker-compose.dev.yml up -d

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando que PostgreSQL esté listo..."
sleep 10

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose -f docker-compose.dev.yml ps

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
docker-compose -f docker-compose.dev.yml exec api yarn mg:run

echo ""
echo "✅ Entorno de desarrollo listo!"
echo "📌 La API está disponible en: http://localhost:3005"
echo "📌 Hot reload está habilitado"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: docker-compose -f docker-compose.dev.yml logs -f api"
echo "  - Parar servicios: docker-compose -f docker-compose.dev.yml down"
echo "  - Reiniciar API: docker-compose -f docker-compose.dev.yml restart api"
echo "" 