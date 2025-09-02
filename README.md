# TechCare

Sistema de Registro de Mantenimiento de Equipos con IA

## 🚀 Características

- ✅ Registro completo de mantenimiento de equipos
- 🤖 Sugerencias inteligentes de tareas con IA (Google Genkit)
- 📊 Historial detallado de mantenimientos
- 🎨 Interfaz moderna y responsive
- 🗄️ Base de datos PostgreSQL con Drizzle ORM
- ☁️ Despliegue automático en Netlify + Neon

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **UI**: Radix UI, Lucide Icons
- **Base de datos**: PostgreSQL, Drizzle ORM
- **IA**: Google Genkit AI
- **Despliegue**: Netlify, Neon
- **CI/CD**: GitHub Actions

## 📦 Instalación

### Desarrollo Local

```bash
# Clonar el repositorio
git clone <tu-repo>
cd studio-main

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus valores

# Configurar base de datos
npm run db:push

# Iniciar desarrollo
npm run dev
```

### Variables de Entorno Requeridas

```env
# Base de datos (Neon)
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Google AI (Genkit)
GOOGLE_GENAI_API_KEY="your-google-ai-api-key"
```

## 🗄️ Base de Datos

### Esquema

- **maintenance_records**: Registros de mantenimiento
  - `id`: ID único (serial)
  - `equipment`: Tipo de equipo
  - `user`: Usuario del equipo
  - `technician`: Técnico responsable
  - `date`: Fecha de mantenimiento
  - `tasks`: Lista de tareas realizadas (JSON)
  - `status`: Estado del mantenimiento
  - `notes`: Notas adicionales
  - `createdAt`: Fecha de creación
  - `updatedAt`: Fecha de actualización

### Comandos de Base de Datos

```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:push

# Configurar base de datos completa
npm run db:setup

# Abrir Drizzle Studio
npm run db:studio
```

## 🚀 Despliegue

### Configuración Automática

El proyecto está configurado para despliegue automático en Netlify con base de datos Neon.

#### 1. Configurar Neon

1. Crear cuenta en [neon.tech](https://neon.tech)
2. Crear nuevo proyecto
3. Copiar la URL de conexión

#### 2. Configurar Netlify

1. Conectar repositorio en [netlify.com](https://netlify.com)
2. Configurar variables de entorno:
   - `DATABASE_URL`: URL de conexión de Neon
   - `GOOGLE_GENAI_API_KEY`: API key de Google AI

#### 3. Despliegue Automático

- Push a `main` → Despliegue automático
- Las migraciones se ejecutan durante el build
- Configuración en `netlify.toml`

### Configuración Manual

```bash
# Build para producción
npm run build

# Las migraciones se ejecutan automáticamente
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run genkit:dev       # Genkit AI en desarrollo
npm run genkit:watch     # Genkit AI con watch

# Base de datos
npm run db:generate      # Generar migraciones
npm run db:push          # Aplicar migraciones
npm run db:setup         # Configuración completa
npm run db:studio        # Drizzle Studio

# Producción
npm run build            # Build de producción
npm run start            # Servidor de producción
npm run lint             # Linting
npm run typecheck        # Verificación de tipos
```

## 📁 Estructura del Proyecto

```
src/
├── ai/                  # Flujos de IA (Genkit)
├── app/                 # App Router de Next.js
│   ├── actions.ts       # Server Actions
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página principal
├── components/          # Componentes React
│   ├── maintenance-form.tsx
│   ├── maintenance-history.tsx
│   └── ui/              # Componentes UI (Radix)
├── lib/                 # Utilidades y configuración
│   ├── db/              # Base de datos
│   │   ├── schema.ts    # Esquema Drizzle
│   │   ├── queries.ts   # Consultas
│   │   └── index.ts     # Conexión DB
│   └── utils.ts         # Utilidades
└── hooks/               # React Hooks
```

## 🤖 Funcionalidades de IA

- **Sugerencias de tareas**: Basadas en el tipo de equipo
- **Validación de relevancia**: Verifica si las tareas son apropiadas
- **Integración con Google Genkit**: Para procesamiento de lenguaje natural

## 🔒 Seguridad

- Variables de entorno para datos sensibles
- Headers de seguridad configurados
- Validación de datos con Zod
- Conexión SSL a base de datos

## 📝 Uso

1. **Registro de Mantenimiento**:

   - Selecciona equipo, usuario y técnico
   - Agrega tareas manualmente o usa sugerencias de IA
   - Guarda el registro

2. **Historial**:
   - Visualiza todos los registros
   - Edita o elimina registros existentes
   - Filtra por estado, equipo o técnico

## 🐛 Troubleshooting

### Error de conexión a base de datos

- Verificar `DATABASE_URL` en variables de entorno
- Asegurar que la URL incluya `?sslmode=require`

### Error de build

- Verificar que todas las dependencias estén instaladas
- Revisar logs de build en Netlify

### Error de migraciones

- Ejecutar `npm run db:push` localmente
- Verificar esquema en `src/lib/db/schema.ts`

## 📄 Licencia

MIT License
