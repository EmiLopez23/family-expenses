import { Expense } from "@/lib/schema";
import Table from "../custom-table";
import { columns } from "./columns";

interface Props {
  data: Expense[];
}

export default async function DashboardTable({ data }: Props) {
  return <Table<Expense> data={data} columns={columns} />;
}
