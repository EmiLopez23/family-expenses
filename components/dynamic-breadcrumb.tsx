"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

// Route name mappings for better display names
const routeNames: Record<string, string> = {
  tags: "Tags",
  groups: "Groups",
  create: "Create",
  // Add more mappings as needed
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Split pathname and filter out empty strings and route groups
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && !segment.startsWith("("));

  if (pathSegments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const displayName =
            routeNames[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <div key={segment} className="flex items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
