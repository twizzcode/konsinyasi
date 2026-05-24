import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/src/db";
import { transactionItems, transactions } from "@/src/db/schema";
import { requireAuth, requireStoreRole } from "@/src/lib/auth";
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
    await requireStoreRole(user.id, storeId, ["owner", "admin"]);

    const conditions = [eq(transactions.storeId, storeId), eq(transactions.status, "completed")];
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    if (startDate) conditions.push(gte(transactions.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(transactions.createdAt, new Date(`${endDate}T23:59:59.999Z`)));

    const [summary] = await db
      .select({
        totalSales: sql<number>`coalesce(sum(${transactions.totalAmount}), 0)::int`,
        totalTransactions: sql<number>`count(distinct ${transactions.id})::int`,
        totalItemsSold: sql<number>`coalesce(sum(${transactionItems.quantity}), 0)::int`,
      })
      .from(transactions)
      .leftJoin(transactionItems, eq(transactionItems.transactionId, transactions.id))
      .where(and(...conditions));

    const averageTransaction = summary.totalTransactions > 0 ? Math.round(summary.totalSales / summary.totalTransactions) : 0;
    return successResponse("Laporan penjualan berhasil diambil", { ...summary, averageTransaction });
  } catch (error) {
    return routeError(error);
  }
}
