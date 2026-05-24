import { and, count, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { products, stockMovements, suppliers } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreAccess, requireStoreRole } from "@/src/lib/auth";
import { errorResponse, paginatedResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { getPagination, parseJsonBody, productStatusSchema, uuidSchema } from "@/src/lib/validation";

const createProductSchema = z
  .object({
    storeId: uuidSchema,
    supplierId: uuidSchema,
    name: z.string().trim().min(1, "Nama produk wajib diisi"),
    description: z.string().trim().optional().nullable(),
    sku: z.string().trim().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    purchasePrice: z.number().int().nonnegative(),
    sellingPrice: z.number().int().nonnegative(),
    stock: z.number().int().nonnegative().default(0),
    minimumStock: z.number().int().nonnegative().default(0),
    consignmentRate: z.number().int().min(0).max(100).optional().nullable(),
    status: productStatusSchema.default("active"),
  })
  .refine((data) => data.sellingPrice >= data.purchasePrice, {
    message: "Harga jual tidak boleh lebih kecil dari harga modal",
    path: ["sellingPrice"],
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

    const conditions = [eq(products.storeId, storeId)];
    const search = url.searchParams.get("search");
    const supplierId = url.searchParams.get("supplierId");
    const status = url.searchParams.get("status");

    if (search) conditions.push(ilike(products.name, `%${search}%`));
    if (supplierId) conditions.push(eq(products.supplierId, uuidSchema.parse(supplierId)));
    if (status) conditions.push(eq(products.status, productStatusSchema.parse(status)));
    if (member.role === "supplier") {
      const [supplier] = await db.select().from(suppliers).where(and(eq(suppliers.storeId, storeId), eq(suppliers.userId, user.id))).limit(1);
      conditions.push(eq(products.supplierId, supplier?.id ?? "00000000-0000-0000-0000-000000000000"));
    }

    const where = and(...conditions);
    const data = await db.select().from(products).where(where).orderBy(desc(products.createdAt)).limit(limit).offset(offset);
    const [{ total }] = await db.select({ total: count() }).from(products).where(where);

    return paginatedResponse("Daftar produk berhasil diambil", data, {
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
    const body = await parseJsonBody(request, createProductSchema);
    await requireStoreRole(user.id, body.storeId, ["owner", "admin"]);

    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(and(eq(suppliers.id, body.supplierId), eq(suppliers.storeId, body.storeId)))
      .limit(1);
    if (!supplier) throw new ApiError("Supplier tidak ditemukan pada toko ini", "NOT_FOUND", 404);

    const product = await db.transaction(async (tx) => {
      const [created] = await tx.insert(products).values(body).returning();
      if (body.stock > 0) {
        await tx.insert(stockMovements).values({
          storeId: body.storeId,
          productId: created.id,
          type: "in",
          quantity: body.stock,
          previousStock: 0,
          currentStock: body.stock,
          notes: "Stok awal produk",
          createdBy: user.id,
        });
      }
      return created;
    });

    return successResponse("Produk berhasil dibuat", product, 201);
  } catch (error) {
    return routeError(error);
  }
}
