import { eq, desc } from "drizzle-orm";
import { db } from "./index";
import {
  maintenanceRecords,
  type MaintenanceRecord,
  type NewMaintenanceRecord,
} from "./schema";

// Crear un nuevo registro de mantenimiento
export async function createMaintenanceRecord(
  data: NewMaintenanceRecord
): Promise<MaintenanceRecord> {
  const [record] = await db
    .insert(maintenanceRecords)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();

  return record;
}

// Obtener todos los registros de mantenimiento
export async function getAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
  return await db
    .select()
    .from(maintenanceRecords)
    .orderBy(desc(maintenanceRecords.createdAt));
}

// Obtener un registro por ID
export async function getMaintenanceRecordById(
  id: number
): Promise<MaintenanceRecord | null> {
  const [record] = await db
    .select()
    .from(maintenanceRecords)
    .where(eq(maintenanceRecords.id, id))
    .limit(1);

  return record || null;
}

// Actualizar un registro de mantenimiento
export async function updateMaintenanceRecord(
  id: number,
  data: Partial<NewMaintenanceRecord>
): Promise<MaintenanceRecord | null> {
  const [record] = await db
    .update(maintenanceRecords)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(maintenanceRecords.id, id))
    .returning();

  return record || null;
}

// Eliminar un registro de mantenimiento
export async function deleteMaintenanceRecord(id: number): Promise<boolean> {
  const result = await db
    .delete(maintenanceRecords)
    .where(eq(maintenanceRecords.id, id));

  return result.rowCount > 0;
}

// Obtener registros por equipo
export async function getMaintenanceRecordsByEquipment(
  equipment: string
): Promise<MaintenanceRecord[]> {
  return await db
    .select()
    .from(maintenanceRecords)
    .where(eq(maintenanceRecords.equipment, equipment))
    .orderBy(desc(maintenanceRecords.date));
}

// Obtener registros por técnico
export async function getMaintenanceRecordsByTechnician(
  technician: string
): Promise<MaintenanceRecord[]> {
  return await db
    .select()
    .from(maintenanceRecords)
    .where(eq(maintenanceRecords.technician, technician))
    .orderBy(desc(maintenanceRecords.date));
}

// Obtener registros por estado
export async function getMaintenanceRecordsByStatus(
  status: string
): Promise<MaintenanceRecord[]> {
  return await db
    .select()
    .from(maintenanceRecords)
    .where(eq(maintenanceRecords.status, status))
    .orderBy(desc(maintenanceRecords.date));
}
