import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla de registros de mantenimiento
export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  equipment: varchar("equipment", { length: 100 }).notNull(),
  user: varchar("user", { length: 100 }).notNull(),
  technician: varchar("technician", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  tasks: json("tasks").$type<string[]>().notNull().default([]),
  status: varchar("status", { length: 50 }).notNull().default("Pendiente"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Esquemas de validación con Zod
export const insertMaintenanceRecordSchema = createInsertSchema(
  maintenanceRecords,
  {
    equipment: z.string().min(1, "Debe seleccionar un equipo"),
    user: z.string().min(1, "Debe seleccionar un usuario"),
    technician: z.string().min(1, "Debe seleccionar un técnico"),
    date: z.date(),
    tasks: z.array(z.string()).default([]),
    status: z
      .enum(["Completado", "Pendiente", "En Progreso"])
      .default("Pendiente"),
    notes: z.string().optional(),
  }
);

export const selectMaintenanceRecordSchema =
  createSelectSchema(maintenanceRecords);

// Tipos TypeScript
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type NewMaintenanceRecord = typeof maintenanceRecords.$inferInsert;
