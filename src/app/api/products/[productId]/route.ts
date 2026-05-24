import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { products, suppliers, transactionItems } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreAccess, requireStoreRole } from "@/src/lib/auth";
import { successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { parseJsonBody, productStatusSchema, uuidSchema } from "@/src/lib/validation";

const updateProductSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi").optional(),
  description: z.string().trim().optional().nullable(),
  sku: z.string().trim().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  purchasePrice: z.number().int().nonnegative().optional(),
  sellingPrice: z.number().int().nonnegative().optional(),
  minimumStock: z.number().int().nonnegative().optional(),
  consignmentRate: z.number().int().min(0).max(100).optional().nullable(),
  status: productStatusSchema.optional(),
});

type Ctx = { params: Promise<{ productId: string }> };

async function findProduct(productId: string) {
  const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (!product) throw new ApiError("Produk tidak ditemukan", "NOT_FOUND", 404);
  return product;
}

async function assertCanReadProduct(userId: string, product: Awaited<ReturnType<typeof findProduct>>) {
  const member = await requireStoreAccess(userId, product.storeId);
  if (member.role === "supplier") {
    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(and(eq(suppliers.id, product.supplierId), eq(suppliers.userId, userId)))
      .limit(1);
    if (!supplier) throw new ApiError("User tidak boleh melihat produk ini", "FORBIDDEN", 403);
  }
}

export async function GET(request: Request, ctx: Ctx) {
  try {
    const { productId } = await ctx.params;
    uuidSchema.parse(productId);
    const user = await requireAuth(request);
    const product = await findProduct(productId);
    await assertCanReadProduct(user.id, product);
    return successResponse("Detail produk berhasil diambil", product);
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const { productId } = await ctx.params;
    uuidSchema.parse(productId);
    const user = await requireAuth(request);
    const product = await findProduct(productId);
    await requireStoreRole(user.id, product.storeId, ["owner", "admin"]);
    const body = await parseJsonBody(request, updateProductSchema);
    const purchasePrice = body.purchasePrice ?? product.purchasePrice;
    const sellingPrice = body.sellingPrice ?? product.sellingPrice;
    if (sellingPrice < purchasePrice) {
      throw new ApiError("Harga jual tidak boleh lebih kecil dari harga modal", "VALIDATION_ERROR", 422);
    }

    const [updated] = await db
      .update(products)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    return successResponse("Produk berhasil diperbarui", updated);
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const { productId } = await ctx.params;
    uuidSchema.parse(productId);
    const user = await requireAuth(request);
    const product = await findProduct(productId);
    await requireStoreRole(user.id, product.storeId, ["owner", "admin"]);

    const [used] = await db.select({ id: transactionItems.id }).from(transactionItems).where(eq(transactionItems.productId, productId)).limit(1);
    if (used) {
      const [updated] = await db
        .update(products)
        .set({ status: "inactive", updatedAt: new Date() })
        .where(eq(products.id, productId))
        .returning();
      return successResponse("Produk berhasil dinonaktifkan", updated);
    }

    const [updated] = await db
      .update(products)
      .set({ status: "inactive", updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    return successResponse("Produk berhasil dinonaktifkan", updated);
  } catch (error) {
    return routeError(error);
  }
}
