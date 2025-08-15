# 🐳 Guía de Docker para Asistente RRHH API

## Descripción

Esta aplicación NestJS ha sido dockerizada para facilitar el desarrollo y el despliegue. Incluye configuración para PostgreSQL y la API.

## Archivos Docker creados

### 1. `Dockerfile`

- Imagen multi-stage optimizada para producción
- Usa Node.js 18 Alpine para tamaño mínimo
- Configura usuario no-root para seguridad
- Optimizado para builds rápidos

### 2. `docker-compose.yml`

- Configuración para producción
- Incluye PostgreSQL y API
- Redes aisladas
- Health checks
- Volúmenes persistentes

### 3. `docker-compose.dev.yml`

- Configuración para desarrollo
- Hot reload habilitado
- Monta el código fuente como volumen

### 4. `.dockerignore`

- Optimiza el build excluyendo archivos innecesarios
- Reduce el tamaño del contexto de build

### 5. `.env` y `.env.example`

- Variables de entorno configuradas
- Ejemplo para nuevos desarrolladores

## Comandos para usar

### Para desarrollo (con hot reload)

```bash
# Levantar los servicios en modo desarrollo
docker-compose -f docker-compose.dev.yml up

# Levantar en segundo plano
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f api

# Parar servicios
docker-compose -f docker-compose.dev.yml down
```

### Para producción

```bash
# Construir y levantar servicios
docker-compose up --build

# Levantar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar servicios
docker-compose down
```

### Comandos útiles

```bash
# Ejecutar migraciones
docker-compose exec api yarn mg:run

# Acceder al contenedor de la API
docker-compose exec api sh

# Acceder a PostgreSQL
docker-compose exec postgres psql -U postgres -d postgres

# Limpiar todo (¡cuidado, borra los datos!)
docker-compose down -v
docker system prune -f
```

## Puertos expuestos

- **API**: http://localhost:3005
- **PostgreSQL**: localhost:5432

## Estructura de la aplicación dockerizada

```
📁 assitant-rrhh-v0-api/
├── 🐳 Dockerfile                 # Imagen de producción
├── 🐳 docker-compose.yml         # Orquestación para producción
├── 🐳 docker-compose.dev.yml     # Orquestación para desarrollo
├── 🐳 .dockerignore              # Archivos excluidos del build
├── 🔧 .env                       # Variables de entorno
├── 🔧 .env.example               # Ejemplo de variables
└── 📖 README-Docker.md           # Esta guía
```

## Notas importantes

1. **Primer inicio**: La base de datos se crea automáticamente
2. **Migraciones**: Ejecutar manualmente después del primer inicio
3. **Variables de entorno**: Cambiar JWT_SECRET en producción
4. **Volúmenes**: Los datos de PostgreSQL persisten entre reinicios
5. **Desarrollo**: Usa `docker-compose.dev.yml` para desarrollo con hot reload

## Solución de problemas

### La aplicación no inicia

```bash
# Verificar logs
docker-compose logs api

# Verificar estado de PostgreSQL
docker-compose exec postgres pg_isready -U postgres
```

### Base de datos no conecta

```bash
# Verificar red
docker network ls

# Verificar variables de entorno
docker-compose exec api env | grep POSTGRES
```

### Puerto ocupado

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - '3006:3005'  # Puerto host:contenedor
```
