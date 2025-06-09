import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import NumberFlow from "@number-flow/react";

const iconMap = {
  expenses: DollarSign,
};

interface Props {
  cards: {
    title: string;
    value: number;
    type: keyof typeof iconMap;
  }[];
}

export default async function DashboardCards({ cards }: Props) {
  return (
    <>
      {cards.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </>
  );
}

export function DashboardCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: "expenses";
}) {
  const Icon = iconMap[type];

  return (
    <Card className="gap-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <NumberFlow
          value={value}
          className="text-2xl font-bold"
          format={{
            style: "currency",
            currency: "ARS",
          }}
          locales="es-AR"
        />
      </CardContent>
    </Card>
  );
}
