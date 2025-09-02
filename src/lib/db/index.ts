import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Configuración de la conexión a la base de datos
const connectionString = process.env.DATABASE_URL!;

// Crear la conexión de postgres
const client = postgres(connectionString, {
  prepare: false,
});

// Crear la instancia de drizzle
export const db = drizzle(client, { schema });

// Exportar el esquema para uso en otras partes de la aplicación
export * from "./schema";
