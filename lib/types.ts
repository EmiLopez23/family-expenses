import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1),
  pageSize: z.number().min(1),
});

export const filtersSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type Filters = z.infer<typeof filtersSchema>;
