import { Badge } from "./badge";

interface Props {
  name: string;
  color: string;
}

export default function Tag({ name, color }: Props) {
  return (
    <Badge
      className="flex items-center gap-2"
      variant="outline"
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 10%, rgba(0, 0, 0, 0.1))`,
        borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
      }}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <p className="text-xs capitalize">{name}</p>
    </Badge>
  );
}
