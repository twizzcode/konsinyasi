import { z } from "zod";

export const uuidSchema = z.uuid("UUID tidak valid");
export const optionalText = z.string().trim().optional().nullable();
export const emailSchema = z.email("Email tidak valid");

export const roleSchema = z.enum(["owner", "admin", "supplier"]);
export const memberStatusSchema = z.enum(["active", "inactive", "pending"]);
export const productStatusSchema = z.enum(["active", "inactive", "out_of_stock"]);
export const stockMovementTypeSchema = z.enum(["in", "out", "adjustment", "sale", "return"]);
export const paymentMethodSchema = z.enum(["cash", "transfer", "qris", "other"]);

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export function getPagination(searchParams: URLSearchParams) {
  const parsed = paginationSchema.parse({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  return {
    ...parsed,
    offset: (parsed.page - 1) * parsed.limit,
  };
}

export function parseJsonBody<T>(request: Request, schema: z.ZodType<T>) {
  return request.json().then((body) => schema.parse(body));
}

export function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(", ");
}

export function isUuid(value: string | null | undefined): value is string {
  return Boolean(value && z.uuid().safeParse(value).success);
}
