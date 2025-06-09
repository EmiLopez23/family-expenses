import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type Group = {
  id: string;
  name: string;
};

interface GroupSelectorProps {
  selectedGroups: string[];
  onSelectChange: (groups: string[]) => void;
  availableGroups: Group[];
}

export function GroupSelector({
  selectedGroups,
  onSelectChange,
  availableGroups,
}: GroupSelectorProps) {

  // Handle all groups selection
  const handleAllGroupsChange = (checked: boolean) => {
    if (checked) {
      onSelectChange(availableGroups.map((group) => group.id));
    } else {
      onSelectChange([]);
    }
  };

  // Handle group selection
  const handleGroupToggle = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      onSelectChange(selectedGroups.filter((id) => id !== groupId));
    } else {
      onSelectChange([...selectedGroups, groupId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="include-all-groups" className="text-base font-medium">
          Groups
        </Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="include-all-groups"
            disabled={availableGroups.length === 0}
            checked={selectedGroups.length === availableGroups.length}
            onCheckedChange={handleAllGroupsChange}
          />
          <Label htmlFor="include-all-groups" className="text-sm font-normal">
            Include in all groups
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {availableGroups.map((group) => (
          <Card
            key={group.id}
            aria-selected={selectedGroups.includes(group.id)}
            className={cn(
              "p-0",
              "cursor-pointer",
              "transition-all",
              "aria-selected:ring-2",
              "aria-selected:ring-primary",
              "aria-selected:opacity-100",
              "aria-selected:bg-accent",
              "aria-selected:text-accent-foreground"
            )}
            onClick={() => handleGroupToggle(group.id)}
          >
            <CardContent className="p-4 flex items-center justify-center text-center capitalize h-full">
              {group.name}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
