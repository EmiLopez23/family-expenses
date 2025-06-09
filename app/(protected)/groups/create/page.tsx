import { fetchUsers } from "@/lib/data";
import GroupCreatorDialog from "@/components/groups/group-creator-dialog";

export default async function CreateGroupPage() {
  const users = await fetchUsers();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Crear nuevo grupo</h1>
        <p className="text-muted-foreground mb-6">
          Crea un grupo para compartir gastos con tus amigos o familiares
        </p>
        <GroupCreatorDialog users={users} />
      </div>
    </div>
  );
}
