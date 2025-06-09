import { cn } from "@/lib/utils";

export default function ErrorMessage({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.ComponentProps<"p">;
}) {
  return (
    <p
      data-slot="form-message"
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {children}
    </p>
  );
}
