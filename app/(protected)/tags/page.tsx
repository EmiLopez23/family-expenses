import TagsTable from "@/components/tags/tags-table";
import { fetchUserTags } from "@/lib/data";

export default async function TagsPage() {
  const tags = await fetchUserTags();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tus tags</h2>
        <p className="text-muted-foreground">
          Aquí puedes ver tus tags
        </p>
      </div>
      <TagsTable tags={tags} />
    </div>
  );
}
