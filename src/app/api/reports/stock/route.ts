import { and, eq, sql } from "drizzle-orm";
import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { requireAuth, requireStoreRole } from "@/src/lib/auth";
import { errorResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { uuidSchema } from "@/src/lib/validation";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const storeId = new URL(request.url).searchParams.get("storeId");
    if (!storeId) return errorResponse("storeId wajib diisi", "BAD_REQUEST", 400);
    uuidSchema.parse(storeId);
    await requireStoreRole(user.id, storeId, ["owner", "admin"]);

    const [summary] = await db
      .select({
        totalProducts: sql<number>`count(*)::int`,
        lowStockProducts: sql<number>`count(*) filter (where ${products.stock} <= ${products.minimumStock})::int`,
        outOfStockProducts: sql<number>`count(*) filter (where ${products.stock} = 0 or ${products.status} = 'out_of_stock')::int`,
      })
      .from(products)
      .where(and(eq(products.storeId, storeId), eq(products.status, "active")));

    return successResponse("Laporan stok berhasil diambil", summary);
  } catch (error) {
    return routeError(error);
  }
}
