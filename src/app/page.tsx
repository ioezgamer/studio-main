import { History, Wrench, ListChecks } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceForm } from '@/components/maintenance-form';
import { MaintenanceHistory } from '@/components/maintenance-history';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Wrench className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold text-primary font-headline">
              TechCare
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Registro de Mantenimiento de Equipos
          </p>
        </header>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="dashboard"><ListChecks className="mr-2 h-4 w-4" />Registro</TabsTrigger>
            <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />Historial</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <MaintenanceForm />
          </TabsContent>
          <TabsContent value="history">
            <MaintenanceHistory />
          </TabsContent>
        </Tabs>
        
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by AI. Your smart maintenance assistant.</p>
        </footer>
      </div>
    </main>
  );
}
