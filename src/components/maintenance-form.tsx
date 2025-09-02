"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  Cpu,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  checkTaskRelevanceAction,
  suggestTasksAction,
  createMaintenanceRecordAction,
} from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const equipmentList = [
  "Laptop",
  "Desktop",
  "Printer",
  "Server",
  "Network Switch",
  "Mobile Phone",
];
const userList = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const technicianList = ["Frank", "Grace", "Heidi", "Ivan"];

const formSchema = z.object({
  equipment: z.string({ required_error: "Debe seleccionar un equipo." }).min(1),
  user: z.string({ required_error: "Debe seleccionar un usuario." }).min(1),
  technician: z
    .string({ required_error: "Debe seleccionar un técnico." })
    .min(1),
  date: z.date({ required_error: "Debe seleccionar una fecha." }),
  notes: z.string().optional(),
});

type Relevance = { isRelevant: boolean; relevanceExplanation: string };
type Task = {
  id: number;
  description: string;
  status: "checking" | "checked";
  relevance?: Relevance;
};

export function MaintenanceForm() {
  const { toast } = useToast();
  const [isSuggesting, startSuggesting] = React.useTransition();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTask, setNewTask] = React.useState("");
  const [suggestedTasks, setSuggestedTasks] = React.useState<string[]>([]);
  const [nextMaintenanceDate, setNextMaintenanceDate] = React.useState<Date>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { date: new Date(), notes: "" },
  });

  const equipmentType = form.watch("equipment");

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.date) {
        setNextMaintenanceDate(addMonths(value.date, 4));
      }
    });
    // Set initial date
    setNextMaintenanceDate(addMonths(form.getValues("date"), 4));
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSuggestTasks = React.useCallback(async () => {
    if (!equipmentType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, seleccione un tipo de equipo primero.",
      });
      return;
    }
    startSuggesting(async () => {
      const suggestions = await suggestTasksAction({ equipmentType });
      setSuggestedTasks(suggestions);
    });
  }, [equipmentType, toast]);

  const addTask = React.useCallback(
    async (description: string) => {
      if (!description.trim()) return;
      if (!equipmentType) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Por favor, seleccione un tipo de equipo antes de agregar una tarea.",
        });
        return;
      }

      const newId = Date.now();
      const newTask: Task = { id: newId, description, status: "checking" };
      setTasks((prev) => [...prev, newTask]);

      const relevance = await checkTaskRelevanceAction({
        equipmentType,
        taskDescription: description,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === newId ? { ...t, status: "checked", relevance } : t
        )
      );
    },
    [equipmentType, toast]
  );

  const handleAddTask = () => {
    addTask(newTask);
    setNewTask("");
  };

  const handleAddSuggestedTask = (description: string) => {
    addTask(description);
    setSuggestedTasks((prev) => prev.filter((t) => t !== description));
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const taskDescriptions = tasks.map((task) => task.description);

      const result = await createMaintenanceRecordAction({
        equipment: values.equipment,
        user: values.user,
        technician: values.technician,
        date: values.date,
        tasks: taskDescriptions,
        status: "Completado",
        notes: values.notes || null,
      });

      if (result.success) {
        toast({
          title: "Registro Guardado",
          description:
            "La información de mantenimiento ha sido guardada exitosamente.",
          className: "bg-accent text-accent-foreground",
        });
        form.reset();
        setTasks([]);
        setSuggestedTasks([]);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Error al guardar el registro",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error inesperado al guardar el registro",
      });
    }
  }

  return (
    <TooltipProvider>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Nuevo Registro de Mantenimiento
          </CardTitle>
          <CardDescription>
            Complete los detalles a continuación para registrar una nueva
            entrada de mantenimiento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="equipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Cpu className="inline-block mr-2 h-4 w-4" />
                        Equipo
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar equipo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {equipmentList.map((e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <User className="inline-block mr-2 h-4 w-4" />
                        Usuario del Equipo
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar usuario..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userList.map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="technician"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Wrench className="inline-block mr-2 h-4 w-4" />
                        Mantenimiento por
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar técnico..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {technicianList.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Mantenimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2 p-4 bg-secondary/50 rounded-lg flex items-center justify-between">
                  <p className="font-medium">Próximo Mantenimiento:</p>
                  <p className="font-bold text-primary">
                    {nextMaintenanceDate
                      ? format(nextMaintenanceDate, "PPP")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tareas Realizadas</h3>
                <div className="flex gap-2">
                  <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Ej: Limpieza de ventiladores"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTask())
                    }
                  />
                  <Button type="button" onClick={handleAddTask}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Tarea
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSuggestTasks}
                    disabled={isSuggesting || !equipmentType}
                  >
                    {isSuggesting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Sugerir
                  </Button>
                </div>
                {suggestedTasks.length > 0 && (
                  <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
                    <p className="text-sm font-medium">
                      Sugerencias para {equipmentType}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTasks.map((task, i) => (
                        <Button
                          key={i}
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAddSuggestedTask(task)}
                        >
                          {task}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 p-2 bg-secondary/30 rounded-md"
                    >
                      <div className="w-6 text-center">
                        {task.status === "checking" && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {task.status === "checked" && task.relevance && (
                          <Tooltip>
                            <TooltipTrigger>
                              {task.relevance.isRelevant ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{task.relevance.relevanceExplanation}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <span className="flex-1">{task.description}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No se han agregado tareas.
                    </p>
                  )}
                </div>
              </div>
              <Separator />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Comentarios adicionales sobre el mantenimiento..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="p-0 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Guardar Mantenimiento
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
