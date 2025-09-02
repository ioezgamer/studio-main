"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  getAllMaintenanceRecordsAction,
  updateMaintenanceRecordAction,
  deleteMaintenanceRecordAction,
} from "@/app/actions";
import type { MaintenanceRecord } from "@/lib/db/schema";

// Removemos los datos iniciales ya que ahora usamos la base de datos

const equipmentList = [
  "Laptop",
  "Desktop",
  "Printer",
  "Server",
  "Network Switch",
  "Mobile Phone",
];
const userList = ["Alice", "Bob", "Charlie", "Diana", "Eve", "N/A"];
const technicianList = ["Frank", "Grace", "Heidi", "Ivan"];
const statusList = ["Completado", "Pendiente", "En Progreso"];

export function MaintenanceHistory() {
  const { toast } = useToast();
  const [records, setRecords] = React.useState<MaintenanceRecord[]>([]);
  const [editingRecord, setEditingRecord] =
    React.useState<MaintenanceRecord | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Cargar registros al montar el componente
  React.useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const result = await getAllMaintenanceRecordsAction();
      if (result.success && result.records) {
        setRecords(result.records);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Error al cargar los registros",
        });
      }
    } catch (error) {
      console.error("Error loading records:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error inesperado al cargar los registros",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteMaintenanceRecordAction(id);
      if (result.success) {
        setRecords((prev) => prev.filter((record) => record.id !== id));
        toast({
          title: "Registro Eliminado",
          description: `El registro ha sido eliminado exitosamente.`,
          variant: "destructive",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Error al eliminar el registro",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error inesperado al eliminar el registro",
      });
    }
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingRecord({ ...record });
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    try {
      const result = await updateMaintenanceRecordAction(editingRecord.id, {
        equipment: editingRecord.equipment,
        user: editingRecord.user,
        technician: editingRecord.technician,
        date: new Date(editingRecord.date),
        status: editingRecord.status,
        notes: editingRecord.notes,
      });

      if (result.success && result.record) {
        setRecords((prev) =>
          prev.map((rec) =>
            rec.id === editingRecord.id ? result.record! : rec
          )
        );
        toast({
          title: "Registro Actualizado",
          description: `El registro ha sido actualizado exitosamente.`,
          className: "bg-accent text-accent-foreground",
        });
        setEditingRecord(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Error al actualizar el registro",
        });
      }
    } catch (error) {
      console.error("Error updating record:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error inesperado al actualizar el registro",
      });
    }
  };

  const handleEditChange = (field: keyof MaintenanceRecord, value: any) => {
    if (editingRecord) {
      setEditingRecord((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  return (
    <>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Historial de Mantenimiento
          </CardTitle>
          <CardDescription>
            Consulta, edita o elimina registros de mantenimiento pasados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Cargando registros...
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No hay registros de mantenimiento disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        #{record.id}
                      </TableCell>
                      <TableCell>{record.equipment}</TableCell>
                      <TableCell>{record.user}</TableCell>
                      <TableCell>{record.technician}</TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "Completado"
                              ? "default"
                              : record.status === "Pendiente"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            record.status === "Completado" ? "bg-green-500" : ""
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEdit(record)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingRecord && (
        <Dialog
          open={!!editingRecord}
          onOpenChange={(isOpen) => !isOpen && setEditingRecord(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Registro de Mantenimiento</DialogTitle>
              <DialogDescription>
                Modifique los detalles del registro #{editingRecord.id}. Haga
                clic en guardar cuando haya terminado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="equipment" className="text-right">
                  Equipo
                </Label>
                <Select
                  value={editingRecord.equipment}
                  onValueChange={(value) =>
                    handleEditChange("equipment", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar equipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentList.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user" className="text-right">
                  Usuario
                </Label>
                <Select
                  value={editingRecord.user}
                  onValueChange={(value) => handleEditChange("user", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar usuario..." />
                  </SelectTrigger>
                  <SelectContent>
                    {userList.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="technician" className="text-right">
                  Técnico
                </Label>
                <Select
                  value={editingRecord.technician}
                  onValueChange={(value) =>
                    handleEditChange("technician", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar técnico..." />
                  </SelectTrigger>
                  <SelectContent>
                    {technicianList.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Fecha
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !editingRecord.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingRecord.date ? (
                        format(new Date(editingRecord.date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(editingRecord.date)}
                      onSelect={(date) =>
                        date && handleEditChange("date", date.toISOString())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Estado
                </Label>
                <Select
                  value={editingRecord.status}
                  onValueChange={(value) => handleEditChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {statusList.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" onClick={handleSaveEdit}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
