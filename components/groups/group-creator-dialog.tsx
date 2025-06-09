"use client";

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
import { Textarea } from "../ui/textarea";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateGroup, Profile } from "@/lib/schema";
import { createGroupSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../ui/error-message";
import { createGroup } from "@/actions/create/group";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface GroupCreatorDialogProps {
  users: Profile[];
}

export default function GroupCreatorDialog({ users }: GroupCreatorDialogProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<CreateGroup>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers((prev) => {
      const newMembers = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];

      form.setValue("members", newMembers);
      return newMembers;
    });
  };

  const clientAction = async (_: FormData) => {
    const formData = new FormData();
    formData.set("name", form.getValues("name"));
    formData.set("description", form.getValues("description") || "");
    formData.set("members", JSON.stringify(selectedMembers));

    try {
      await createGroup(formData);
      setOpen(false);
      form.reset();
      setSelectedMembers([]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nuevo grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Grupo</DialogTitle>
          <DialogDescription>
            Crea un nuevo grupo y selecciona los miembros que quieres incluir
          </DialogDescription>
        </DialogHeader>
        <form action={clientAction} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del grupo</Label>
            <Input
              {...form.register("name")}
              id="name"
              placeholder="Ingresa el nombre del grupo"
              className="mt-1"
            />
            <ErrorMessage>{form.formState.errors.name?.message}</ErrorMessage>
          </div>

          <div>
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              {...form.register("description")}
              id="description"
              placeholder="Describe el propósito del grupo"
              className="mt-1"
            />
            <ErrorMessage>
              {form.formState.errors.description?.message}
            </ErrorMessage>
          </div>

          <div>
            <Label>Seleccionar miembros</Label>
            <div className="mt-2 max-h-40 overflow-y-auto space-y-2 border rounded-md p-3">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={user.id}
                      checked={selectedMembers.includes(user.id)}
                      onCheckedChange={() => handleMemberToggle(user.id)}
                    />
                    <Label
                      htmlFor={user.id}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {user.full_name || "Usuario sin nombre"}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay usuarios disponibles para agregar al grupo
                </p>
              )}
            </div>
            <ErrorMessage>
              {form.formState.errors.members?.message}
            </ErrorMessage>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear grupo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
