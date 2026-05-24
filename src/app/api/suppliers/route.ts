import { and, count, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { storeMembers, suppliers } from "@/src/db/schema";
import { requireAuth, requireStoreAccess, requireStoreRole } from "@/src/lib/auth";
import { errorResponse, paginatedResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { emailSchema, getPagination, parseJsonBody, uuidSchema } from "@/src/lib/validation";

const createSupplierSchema = z.object({
  storeId: uuidSchema,
  userId: uuidSchema.optional().nullable(),
  name: z.string().trim().min(1, "Nama supplier wajib diisi"),
  phone: z.string().trim().optional().nullable(),
  email: emailSchema.optional().nullable(),
  address: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const url = new URL(request.url);
    const storeId = url.searchParams.get("storeId");
    if (!storeId) return errorResponse("storeId wajib diisi", "BAD_REQUEST", 400);
    uuidSchema.parse(storeId);
    const member = await requireStoreAccess(user.id, storeId);
    const { page, limit, offset } = getPagination(url.searchParams);
    const search = url.searchParams.get("search");
    const conditions = [eq(suppliers.storeId, storeId)];

    if (search) conditions.push(ilike(suppliers.name, `%${search}%`));
    if (member.role === "supplier") conditions.push(eq(suppliers.userId, user.id));

    const where = and(...conditions);
    const data = await db.select().from(suppliers).where(where).orderBy(desc(suppliers.createdAt)).limit(limit).offset(offset);
    const [{ total }] = await db.select({ total: count() }).from(suppliers).where(where);

    return paginatedResponse("Daftar supplier berhasil diambil", data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = await parseJsonBody(request, createSupplierSchema);
    await requireStoreRole(user.id, body.storeId, ["owner", "admin"]);

    const [supplier] = await db.insert(suppliers).values({
      ...body,
      userId: body.userId ?? null,
    }).returning();

    if (body.userId) {
      await db
        .insert(storeMembers)
        .values({ storeId: body.storeId, userId: body.userId, role: "supplier", status: "active" })
        .onConflictDoNothing();
    }

    return successResponse("Supplier berhasil dibuat", supplier, 201);
  } catch (error) {
    return routeError(error);
  }
}
