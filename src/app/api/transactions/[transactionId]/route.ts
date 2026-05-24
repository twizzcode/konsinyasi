import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { transactionItems, transactions } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreAccess } from "@/src/lib/auth";
import { successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { uuidSchema } from "@/src/lib/validation";

type Ctx = { params: Promise<{ transactionId: string }> };

export async function GET(request: Request, ctx: Ctx) {
  try {
    const { transactionId } = await ctx.params;
    uuidSchema.parse(transactionId);
    const user = await requireAuth(request);
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
    if (!transaction) throw new ApiError("Transaksi tidak ditemukan", "NOT_FOUND", 404);
    await requireStoreAccess(user.id, transaction.storeId);
    const items = await db.select().from(transactionItems).where(eq(transactionItems.transactionId, transactionId));

    return successResponse("Detail transaksi berhasil diambil", { ...transaction, items });
  } catch (error) {
    return routeError(error);
  }
}
