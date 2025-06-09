import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type Tag = {
  id: string;
  name: string;
};

interface TagSelectorProps {
  selectedTags?: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  availableTags?: Tag[];
}

export function TagSelector({
  selectedTags = [],
  onTagsChange,
  availableTags = [],
}: TagSelectorProps) {
  const [tagSearchValue, setTagSearchValue] = useState<string>("");

  const handleTagSelection = (tag: Tag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleCreateTag = () => {
    // if (!tagSearchValue.trim()) return;
    // const newTag = {
    //   id: `new-${Date.now()}`,
    //   name: tagSearchValue.trim(),
    // };
    // onTagsChange([...selectedTags, newTag]);
    // setTagSearchValue("");
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="flex items-center gap-1 select-none hover:bg-accent capitalize"
            onClick={() => handleRemoveTag(tag.id)}
          >
            {tag.name}
            <X className="h-3 w-3 cursor-pointer" />
          </Badge>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {selectedTags.length > 0
                ? `${selectedTags.length} tag${
                    selectedTags.length > 1 ? "s" : ""
                  } selected`
                : "Search or create tags"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[334px] p-0">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={tagSearchValue}
              onValueChange={setTagSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="py-3 px-4 text-sm">
                  <p>No tags found.</p>
                  {tagSearchValue !== "" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={handleCreateTag}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{tagSearchValue}"
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {availableTags
                  .filter((tag) =>
                    tag.name
                      .toLowerCase()
                      .includes(tagSearchValue.toLowerCase())
                  )
                  .map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleTagSelection(tag)}
                      className="flex items-center gap-3"
                    >
                      <Checkbox
                        id={tag.id}
                        checked={selectedTags.some((t) => t.id === tag.id)}
                      />
                      <Label htmlFor={tag.id} className="capitalize">
                        {tag.name}
                      </Label>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
