import { useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const DEFAULT_COLORS = [
  "#CCCCCC", // Gray
  "#BEC2C8", // Gray
  "#95A2B3", // Gray,
  "#2C4CFF", // Blue
  "#5E6AD2", // Indigo,
  "#26B5CE", // Cyan
  "#4CB782", // Green
  "#F0BF00", // Yellow
  "#F2994A", // Orange
  "#F7C8C1", // Pink
  "#EB5757", // Red
];

interface Props {
  colors?: string[];
  onChange: (color: string) => void;
  value: string;
}

export default function ColorSelector({
  colors = DEFAULT_COLORS,
  onChange,
  value,
}: Props) {
  const [selectedColor, setSelectedColor] = useState(value ?? colors[0]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onChange(color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <div
            className="size-4 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <div className="flex flex-row gap-2">
          {colors.map((color) => (
            <Button
              key={color}
              variant="outline"
              size="icon"
              className="rounded-full size-6 p-0"
              onClick={() => handleColorChange(color)}
            >
              <div
                className="size-full rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
