import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ExpenseForm from "./form";
import { fetchUserTags } from "@/lib/data";
import { fetchCurrencies } from "@/lib/data";
import { fetchUserGroups } from "@/lib/data";

export default async function ExpenseCreatorDialog() {
  const currencies = await fetchCurrencies();
  const tags = await fetchUserTags();
  const groups = await fetchUserGroups();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-2">
          <Plus />
          <span>Agregar gasto</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear gasto</DialogTitle>
          <DialogDescription>
            Elegí el grupo, tags y monto de tu nuevo gasto
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm currencies={currencies} tags={tags} groups={groups} />
      </DialogContent>
    </Dialog>
  );
}
