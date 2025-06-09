import { Card, CardContent } from "@/components/ui/card";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import DashboardCards from "@/components/dashboard/cards";
import { Suspense } from "react";
import { CardsSkeleton } from "@/components/ui/skeletons";
import DashboardTable from "@/components/dashboard/table";
import { fetchCardData, fetchUserExpenses } from "@/lib/data";

export default async function HomePage() {
  const today = new Date();
  const currentMonth = format(today, "LLLL", { locale: es });
  const startDate = startOfMonth(today).toISOString();
  const endDate = endOfMonth(today).toISOString();

  const [cards, expenses] = await Promise.all([
    fetchCardData(startDate, endDate),
    fetchUserExpenses(startDate, endDate),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tus gastos</h2>
        <p className="text-muted-foreground">
          Aquí puedes ver tus gastos del mes de {currentMonth}
        </p>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Suspense fallback={<CardsSkeleton />}>
          <DashboardCards cards={cards} />
        </Suspense>
      </div>
      <Card className="flex-1 md:min-h-min">
        <CardContent>
          <DashboardTable data={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}
