#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Iniciando migraciones de base de datos...");

try {
  // Verificar que DATABASE_URL esté configurada
  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL no está configurada");
    process.exit(1);
  }

  console.log("📦 Generando migraciones...");
  execSync("npx drizzle-kit generate", { stdio: "inherit" });

  console.log("🔄 Aplicando migraciones...");
  execSync("npx drizzle-kit push", { stdio: "inherit" });

  console.log("✅ Migraciones completadas exitosamente");
} catch (error) {
  console.error("❌ Error durante las migraciones:", error.message);
  process.exit(1);
}
