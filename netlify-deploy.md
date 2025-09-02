# Guía de Despliegue en Netlify con Neon

## Configuración de Neon

1. **Crear cuenta en Neon**:

   - Ve a [neon.tech](https://neon.tech)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Obtener la URL de conexión**:
   - En el dashboard de Neon, ve a "Connection Details"
   - Copia la "Connection String" que se ve así:
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## Configuración de Netlify

1. **Conectar repositorio**:

   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu repositorio de GitHub
   - Selecciona este proyecto

2. **Configurar variables de entorno**:
   En el dashboard de Netlify, ve a:

   - Site settings → Environment variables
   - Agrega las siguientes variables:

   ```
   DATABASE_URL = postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   GOOGLE_GENAI_API_KEY = tu-api-key-de-google-ai
   ```

3. **Configurar build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

## Configuración Automática

El archivo `netlify.toml` ya está configurado con:

- Plugin de Next.js
- Variables de entorno
- Headers de seguridad
- Configuración de caché

## Migraciones de Base de Datos

Las migraciones se ejecutarán automáticamente durante el build gracias al script:

```json
"build": "drizzle-kit generate && next build"
```

## Comandos Útiles

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus valores

# Ejecutar migraciones
npm run db:push

# Iniciar desarrollo
npm run dev
```

### Producción

```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Build para producción
npm run build
```

## Verificación Post-Despliegue

1. Verifica que la aplicación se carga correctamente
2. Prueba crear un nuevo registro de mantenimiento
3. Verifica que los datos se guardan en Neon
4. Prueba editar y eliminar registros

## Troubleshooting

### Error de conexión a base de datos

- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que la URL incluya `?sslmode=require`

### Error de build

- Verifica que todas las dependencias estén instaladas
- Revisa los logs de build en Netlify

### Error de migraciones

- Ejecuta `npm run db:push` localmente primero
- Verifica que el esquema esté correcto
