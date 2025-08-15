# 🚀 Guía Rápida - Docker

## Inicio Rápido

### 1. Setup inicial (Producción)

```bash
# Opción 1: Usar el script automático
./scripts/docker-setup.sh

# Opción 2: Manual
docker-compose up -d --build
docker-compose exec api yarn mg:run
```

### 2. Desarrollo con Hot Reload

```bash
# Opción 1: Usar el script automático
./scripts/docker-dev.sh

# Opción 2: Manual
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml exec api yarn mg:run
```

## Comandos Esenciales

```bash
# Ver logs en tiempo real
docker-compose logs -f api

# Parar todo
docker-compose down

# Reiniciar solo la API
docker-compose restart api

# Ejecutar migraciones
docker-compose exec api yarn mg:run

# Acceder al contenedor
docker-compose exec api sh

# Limpiar todo (¡cuidado!)
docker-compose down -v
docker system prune -f
```

## URLs

- **API**: http://localhost:3005
- **PostgreSQL**: localhost:5432

## Archivos Creados

- `Dockerfile` - Imagen de producción
- `docker-compose.yml` - Orquestación producción
- `docker-compose.dev.yml` - Orquestación desarrollo
- `.dockerignore` - Optimización build
- `.env` - Variables de entorno
- `scripts/docker-setup.sh` - Setup automático
- `scripts/docker-dev.sh` - Desarrollo automático

¡Listo para usar! 🎉
