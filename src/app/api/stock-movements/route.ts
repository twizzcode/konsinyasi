import { and, count, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { products, stockMovements, suppliers } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreAccess, requireStoreRole } from "@/src/lib/auth";
import { errorResponse, paginatedResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { getPagination, parseJsonBody, stockMovementTypeSchema, uuidSchema } from "@/src/lib/validation";

const createStockMovementSchema = z.object({
  storeId: uuidSchema,
  productId: uuidSchema,
  type: z.enum(["in", "out", "adjustment"]),
  quantity: z.number().int().nonnegative(),
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

    const conditions = [eq(stockMovements.storeId, storeId)];
    const productId = url.searchParams.get("productId");
    const type = url.searchParams.get("type");
    if (productId) conditions.push(eq(stockMovements.productId, uuidSchema.parse(productId)));
    if (type) conditions.push(eq(stockMovements.type, stockMovementTypeSchema.parse(type)));

    if (member.role === "supplier") {
      const supplierProducts = db
        .select({ id: products.id })
        .from(products)
        .innerJoin(suppliers, eq(suppliers.id, products.supplierId))
        .where(and(eq(products.storeId, storeId), eq(suppliers.userId, user.id)));
      conditions.push(inArray(stockMovements.productId, supplierProducts));
    }

    const where = and(...conditions);
    const data = await db.select().from(stockMovements).where(where).orderBy(desc(stockMovements.createdAt)).limit(limit).offset(offset);
    const [{ total }] = await db.select({ total: count() }).from(stockMovements).where(where);

    return paginatedResponse("Riwayat stok berhasil diambil", data, {
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
    const body = await parseJsonBody(request, createStockMovementSchema);
    await requireStoreRole(user.id, body.storeId, ["owner", "admin"]);

    const movement = await db.transaction(async (tx) => {
      const [product] = await tx
        .select()
        .from(products)
        .where(and(eq(products.id, body.productId), eq(products.storeId, body.storeId)))
        .limit(1);
      if (!product) throw new ApiError("Produk tidak ditemukan", "NOT_FOUND", 404);

      const previousStock = product.stock;
      const currentStock =
        body.type === "in"
          ? previousStock + body.quantity
          : body.type === "out"
            ? previousStock - body.quantity
            : body.quantity;

      if (currentStock < 0) throw new ApiError("Stok produk tidak mencukupi", "INSUFFICIENT_STOCK", 409);

      const nextStatus = currentStock === 0 ? "out_of_stock" : product.status === "out_of_stock" ? "active" : product.status;
      await tx.update(products).set({ stock: currentStock, status: nextStatus, updatedAt: new Date() }).where(eq(products.id, product.id));

      const [created] = await tx
        .insert(stockMovements)
        .values({
          storeId: body.storeId,
          productId: body.productId,
          type: body.type,
          quantity: body.quantity,
          previousStock,
          currentStock,
          notes: body.notes ?? null,
          createdBy: user.id,
        })
        .returning();
      return created;
    });

    return successResponse("Perubahan stok berhasil dibuat", movement, 201);
  } catch (error) {
    return routeError(error);
  }
}
