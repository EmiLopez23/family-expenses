import { Card, CardContent } from "@/components/ui/card";
import { endOfMonth, startOfMonth } from "date-fns";
import DashboardCards from "@/components/dashboard/cards";
import { Suspense } from "react";
import { CardsSkeleton } from "@/components/ui/skeletons";
import DashboardTable from "@/components/dashboard/table";
import { fetchGroupCardData, fetchGroupExpenses, getGroup } from "@/lib/data";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const today = new Date();
  const startDate = startOfMonth(today).toISOString();
  const endDate = endOfMonth(today).toISOString();

  const group = await getGroup(id);

  const [cards, expenses] = await Promise.all([
    fetchGroupCardData(startDate, endDate, id),
    fetchGroupExpenses(startDate, endDate, id),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight capitalize">
          {group.name}
        </h2>
        {group.description && (
          <p className="text-muted-foreground">{group.description}</p>
        )}
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
