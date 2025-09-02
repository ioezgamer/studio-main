# 🚀 Configuración Rápida - TechCare

## ⚡ Setup en 5 minutos

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Base de Datos (Neon)

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Crea un nuevo proyecto
3. Copia la URL de conexión (Connection String)
4. Crea el archivo `.env.local`:

```bash
cp env.example .env.local
```

5. Edita `.env.local` con tu URL de Neon:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
GOOGLE_GENAI_API_KEY="tu-api-key-de-google-ai"
```

### 3. Configurar Base de Datos

```bash
npm run db:push
```

### 4. Iniciar Desarrollo

```bash
npm run dev
```

¡Listo! Tu aplicación estará corriendo en http://localhost:9002

## 🌐 Despliegue en Netlify

### 1. Conectar Repositorio

1. Ve a [netlify.com](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Selecciona este proyecto

### 2. Configurar Variables de Entorno

En Netlify Dashboard → Site settings → Environment variables:

```
DATABASE_URL = postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
GOOGLE_GENAI_API_KEY = tu-api-key-de-google-ai
```

### 3. Despliegue Automático

- Push a `main` → Despliegue automático ✅
- Las migraciones se ejecutan durante el build ✅
- Configuración automática en `netlify.toml` ✅

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor local
npm run db:studio        # Ver base de datos

# Base de datos
npm run db:push          # Aplicar cambios
npm run db:generate      # Generar migraciones

# Producción
npm run build            # Build completo
```

## 🎯 Funcionalidades

- ✅ **Registro de Mantenimiento**: Formulario completo con validación
- ✅ **Historial**: Visualización, edición y eliminación de registros
- ✅ **IA**: Sugerencias inteligentes de tareas
- ✅ **Base de Datos**: PostgreSQL con Drizzle ORM
- ✅ **Despliegue**: Automático en Netlify + Neon

## 🆘 Problemas Comunes

### Error de conexión a DB

```bash
# Verificar URL en .env.local
echo $DATABASE_URL

# Asegurar que incluya ?sslmode=require
```

### Error de build

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error "Cannot find module 'drizzle-zod'"

```bash
# Instalar dependencia faltante
npm install drizzle-zod
```

### Error de migraciones

```bash
# Aplicar migraciones manualmente
npm run db:push
```

## 📞 Soporte

- 📖 Documentación completa: `README.md`
- 🚀 Guía de despliegue: `netlify-deploy.md`
- ⚙️ Configuración: `netlify.toml`
