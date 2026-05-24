import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/src/db";
import { products, suppliers, transactionItems, transactions } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreAccess } from "@/src/lib/auth";
import { errorResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { uuidSchema } from "@/src/lib/validation";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const url = new URL(request.url);
    const storeId = url.searchParams.get("storeId");
    if (!storeId) return errorResponse("storeId wajib diisi", "BAD_REQUEST", 400);
    uuidSchema.parse(storeId);
    const member = await requireStoreAccess(user.id, storeId);
    let supplierId = url.searchParams.get("supplierId");

    if (member.role === "supplier") {
      const [supplier] = await db.select().from(suppliers).where(and(eq(suppliers.storeId, storeId), eq(suppliers.userId, user.id))).limit(1);
      if (!supplier) throw new ApiError("Supplier tidak ditemukan untuk user ini", "NOT_FOUND", 404);
      if (supplierId && supplierId !== supplier.id) throw new ApiError("Supplier hanya boleh melihat laporannya sendiri", "FORBIDDEN", 403);
      supplierId = supplier.id;
    }

    const conditions = [eq(transactions.storeId, storeId), eq(transactions.status, "completed")];
    if (supplierId) conditions.push(eq(transactionItems.supplierId, uuidSchema.parse(supplierId)));
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    if (startDate) conditions.push(gte(transactions.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(transactions.createdAt, new Date(`${endDate}T23:59:59.999Z`)));

    const rows = await db
      .select({
        supplierId: suppliers.id,
        supplierName: suppliers.name,
        totalProductsSold: sql<number>`coalesce(sum(${transactionItems.quantity}), 0)::int`,
        totalRevenue: sql<number>`coalesce(sum(${transactionItems.subtotal}), 0)::int`,
        estimatedSupplierIncome: sql<number>`coalesce(sum(${transactionItems.quantity} * ${products.purchasePrice}), 0)::int`,
        estimatedStoreProfit: sql<number>`coalesce(sum(${transactionItems.subtotal} - (${transactionItems.quantity} * ${products.purchasePrice})), 0)::int`,
      })
      .from(transactionItems)
      .innerJoin(transactions, eq(transactions.id, transactionItems.transactionId))
      .innerJoin(products, eq(products.id, transactionItems.productId))
      .innerJoin(suppliers, eq(suppliers.id, transactionItems.supplierId))
      .where(and(...conditions))
      .groupBy(suppliers.id, suppliers.name);

    return successResponse("Laporan supplier berhasil diambil", supplierId ? (rows[0] ?? null) : rows);
  } catch (error) {
    return routeError(error);
  }
}
