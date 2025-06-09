import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateTag } from "@/lib/schema";
import { createTagSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ColorSelector from "../ui/color-selector";
import ErrorMessage from "../ui/error-message";
import { createTag } from "@/actions/create/tag";

export default function TagCreatorDialog() {
  const form = useForm<CreateTag>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: "",
      color: "#cccccc",
    },
  });

  const clientAction = async (_: FormData) => {
    const formData = new FormData();
    formData.set("name", form.getValues("name"));
    formData.set("color", form.getValues("color"));
    await createTag(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nuevo tag
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Tag</DialogTitle>
          <DialogDescription>
            Elegí el color y nombre de tu nuevo tag
          </DialogDescription>
        </DialogHeader>
        <form action={clientAction} className="space-y-4">
          <div className="flex flex-row gap-2 items-center">
            <ColorSelector
              onChange={(color) => form.setValue("color", color)}
              value={form.getValues("color")}
            />
            <div className="flex-1">
              <Input
                {...form.register("name")}
                className="h-10"
                placeholder="Nombre del tag"
              />
              <ErrorMessage>{form.formState.errors.name?.message}</ErrorMessage>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Crear tag</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
