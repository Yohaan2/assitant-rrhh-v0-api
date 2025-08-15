# Usar Node.js LTS como imagen base
FROM node:22-alpine AS base

# Configurar directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Fase de dependencias
FROM base AS deps
# Copiar archivos de dependencias
COPY package.json yarn.lock* ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Fase de construcción
FROM base AS build
WORKDIR /app

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules
# Copiar código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# Fase de producción
FROM base AS runner
WORKDIR /app

# Crear usuario no root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copiar archivos necesarios
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Cambiar permisos
RUN chown -R nestjs:nodejs /app
USER nestjs

# Exponer puerto
EXPOSE 3005

# Comando de inicio - corregir la extensión del archivo
CMD ["node", "dist/src/main"] 