import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { products, stockMovements, transactionItems, transactions } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreRole } from "@/src/lib/auth";
import { successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { uuidSchema } from "@/src/lib/validation";

type Ctx = { params: Promise<{ transactionId: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const { transactionId } = await ctx.params;
    uuidSchema.parse(transactionId);
    const user = await requireAuth(request);

    const cancelled = await db.transaction(async (tx) => {
      const [transaction] = await tx.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
      if (!transaction) throw new ApiError("Transaksi tidak ditemukan", "NOT_FOUND", 404);
      await requireStoreRole(user.id, transaction.storeId, ["owner", "admin"]);
      if (transaction.status !== "completed") throw new ApiError("Hanya transaksi completed yang bisa dibatalkan", "BAD_REQUEST", 400);

      const items = await tx.select().from(transactionItems).where(eq(transactionItems.transactionId, transaction.id));
      for (const item of items) {
        const [product] = await tx.select().from(products).where(eq(products.id, item.productId)).limit(1);
        if (!product) throw new ApiError("Produk transaksi tidak ditemukan", "NOT_FOUND", 404);
        const currentStock = product.stock + item.quantity;
        await tx
          .update(products)
          .set({ stock: currentStock, status: product.status === "out_of_stock" ? "active" : product.status, updatedAt: new Date() })
          .where(eq(products.id, product.id));
        await tx.insert(stockMovements).values({
          storeId: transaction.storeId,
          productId: product.id,
          type: "return",
          quantity: item.quantity,
          previousStock: product.stock,
          currentStock,
          notes: `Pembatalan ${transaction.invoiceNumber}`,
          createdBy: user.id,
        });
      }

      const [updated] = await tx
        .update(transactions)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(transactions.id, transaction.id))
        .returning();
      return updated;
    });

    return successResponse("Transaksi berhasil dibatalkan", cancelled);
  } catch (error) {
    return routeError(error);
  }
}
