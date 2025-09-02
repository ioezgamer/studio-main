"use server";

import {
  generateMaintenanceTasks,
  type GenerateMaintenanceTasksInput,
} from "@/ai/flows/generate-maintenance-tasks";
import {
  classifyMaintenanceTaskRelevance,
  type ClassifyMaintenanceTaskRelevanceInput,
} from "@/ai/flows/classify-maintenance-task-relevance";
import {
  createMaintenanceRecord,
  getAllMaintenanceRecords,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  type NewMaintenanceRecord,
} from "@/lib/db/queries";

export async function suggestTasksAction(input: GenerateMaintenanceTasksInput) {
  try {
    const result = await generateMaintenanceTasks(input);
    return result.tasks;
  } catch (error) {
    console.error("Error suggesting tasks:", error);
    return [];
  }
}

export async function checkTaskRelevanceAction(
  input: ClassifyMaintenanceTaskRelevanceInput
) {
  try {
    const result = await classifyMaintenanceTaskRelevance(input);
    return result;
  } catch (error) {
    console.error("Error checking task relevance:", error);
    return {
      isRelevant: false,
      relevanceExplanation: "Could not check relevance due to an error.",
    };
  }
}

// Acciones para la base de datos
export async function createMaintenanceRecordAction(
  data: NewMaintenanceRecord
) {
  try {
    const record = await createMaintenanceRecord(data);
    return { success: true, record };
  } catch (error) {
    console.error("Error creating maintenance record:", error);
    return {
      success: false,
      error: "Error al crear el registro de mantenimiento",
    };
  }
}

export async function getAllMaintenanceRecordsAction() {
  try {
    const records = await getAllMaintenanceRecords();
    return { success: true, records };
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    return {
      success: false,
      error: "Error al obtener los registros de mantenimiento",
    };
  }
}

export async function getMaintenanceRecordByIdAction(id: number) {
  try {
    const record = await getMaintenanceRecordById(id);
    return { success: true, record };
  } catch (error) {
    console.error("Error fetching maintenance record:", error);
    return {
      success: false,
      error: "Error al obtener el registro de mantenimiento",
    };
  }
}

export async function updateMaintenanceRecordAction(
  id: number,
  data: Partial<NewMaintenanceRecord>
) {
  try {
    const record = await updateMaintenanceRecord(id, data);
    return { success: true, record };
  } catch (error) {
    console.error("Error updating maintenance record:", error);
    return {
      success: false,
      error: "Error al actualizar el registro de mantenimiento",
    };
  }
}

export async function deleteMaintenanceRecordAction(id: number) {
  try {
    const success = await deleteMaintenanceRecord(id);
    return { success };
  } catch (error) {
    console.error("Error deleting maintenance record:", error);
    return {
      success: false,
      error: "Error al eliminar el registro de mantenimiento",
    };
  }
}
