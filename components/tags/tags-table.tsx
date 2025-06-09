"use client";
import { Tag } from "@/lib/schema";
import Table from "../custom-table";
import { columns } from "./columns";
import { useState } from "react";
import { Input } from "../ui/input";
import TagCreatorDialog from "./tag-creator-dialog";
export default function TagsTable({ tags }: { tags: Tag[] }) {
  const [data, setData] = useState<Tag[]>(tags);
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Buscar tag"
          className="max-w-3xs"
          type="search"
          onChange={(e) =>
            setData(tags.filter((tag) => tag.name.toLowerCase().includes(e.target.value.toLowerCase())))
          }
        />
        <TagCreatorDialog />
      </div>
      <Table<Tag> data={data} columns={columns} />
    </>
  );
}
