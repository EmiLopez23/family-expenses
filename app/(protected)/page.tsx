import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function HomePage() {
  const currentMonth = format(new Date(), "LLLL", { locale: es });
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tus gastos</h2>
        <p className="text-muted-foreground">
          Aquí puedes ver tus gastos del mes de {currentMonth}
        </p>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
