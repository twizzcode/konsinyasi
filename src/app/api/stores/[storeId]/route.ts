import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { stores } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreAccess, requireStoreRole } from "@/src/lib/auth";
import { successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { parseJsonBody, uuidSchema } from "@/src/lib/validation";

const updateStoreSchema = z.object({
  name: z.string().trim().min(1, "Nama toko wajib diisi").optional(),
  description: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
});

type Ctx = { params: Promise<{ storeId: string }> };

export async function GET(request: Request, ctx: Ctx) {
  try {
    const { storeId } = await ctx.params;
    uuidSchema.parse(storeId);
    const user = await requireAuth(request);
    await requireStoreAccess(user.id, storeId);

    const [store] = await db.select().from(stores).where(eq(stores.id, storeId)).limit(1);
    if (!store) throw new ApiError("Toko tidak ditemukan", "NOT_FOUND", 404);

    return successResponse("Detail toko berhasil diambil", store);
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const { storeId } = await ctx.params;
    uuidSchema.parse(storeId);
    const user = await requireAuth(request);
    await requireStoreRole(user.id, storeId, ["owner", "admin"]);
    const body = await parseJsonBody(request, updateStoreSchema);

    const [store] = await db
      .update(stores)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(stores.id, storeId))
      .returning();

    if (!store) throw new ApiError("Toko tidak ditemukan", "NOT_FOUND", 404);
    return successResponse("Toko berhasil diperbarui", store);
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const { storeId } = await ctx.params;
    uuidSchema.parse(storeId);
    const user = await requireAuth(request);
    await requireStoreRole(user.id, storeId, ["owner"]);

    const [deleted] = await db.delete(stores).where(eq(stores.id, storeId)).returning();
    if (!deleted) throw new ApiError("Toko tidak ditemukan", "NOT_FOUND", 404);

    return successResponse("Toko berhasil dihapus", deleted);
  } catch (error) {
    return routeError(error);
  }
}
