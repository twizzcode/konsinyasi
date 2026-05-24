import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { products, suppliers } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreAccess, requireStoreRole } from "@/src/lib/auth";
import { successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { emailSchema, parseJsonBody, uuidSchema } from "@/src/lib/validation";

const updateSupplierSchema = z.object({
  name: z.string().trim().min(1, "Nama supplier wajib diisi").optional(),
  phone: z.string().trim().optional().nullable(),
  email: emailSchema.optional().nullable(),
  address: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
});

type Ctx = { params: Promise<{ supplierId: string }> };

async function findSupplier(supplierId: string) {
  const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, supplierId)).limit(1);
  if (!supplier) throw new ApiError("Supplier tidak ditemukan", "NOT_FOUND", 404);
  return supplier;
}

async function assertCanReadSupplier(userId: string, supplier: Awaited<ReturnType<typeof findSupplier>>) {
  const member = await requireStoreAccess(userId, supplier.storeId);
  if (member.role === "supplier" && supplier.userId !== userId) {
    throw new ApiError("User tidak boleh melihat supplier ini", "FORBIDDEN", 403);
  }
}

export async function GET(request: Request, ctx: Ctx) {
  try {
    const { supplierId } = await ctx.params;
    uuidSchema.parse(supplierId);
    const user = await requireAuth(request);
    const supplier = await findSupplier(supplierId);
    await assertCanReadSupplier(user.id, supplier);
    return successResponse("Detail supplier berhasil diambil", supplier);
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const { supplierId } = await ctx.params;
    uuidSchema.parse(supplierId);
    const user = await requireAuth(request);
    const supplier = await findSupplier(supplierId);
    await requireStoreRole(user.id, supplier.storeId, ["owner", "admin"]);
    const body = await parseJsonBody(request, updateSupplierSchema);

    const [updated] = await db
      .update(suppliers)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(suppliers.id, supplierId))
      .returning();

    return successResponse("Supplier berhasil diperbarui", updated);
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const { supplierId } = await ctx.params;
    uuidSchema.parse(supplierId);
    const user = await requireAuth(request);
    const supplier = await findSupplier(supplierId);
    await requireStoreRole(user.id, supplier.storeId, ["owner", "admin"]);

    const [activeProduct] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.supplierId, supplierId), eq(products.status, "active")))
      .limit(1);
    if (activeProduct) {
      throw new ApiError("Supplier masih memiliki produk aktif", "BAD_REQUEST", 400);
    }

    const [deleted] = await db.delete(suppliers).where(eq(suppliers.id, supplierId)).returning();
    return successResponse("Supplier berhasil dihapus", deleted);
  } catch (error) {
    return routeError(error);
  }
}
