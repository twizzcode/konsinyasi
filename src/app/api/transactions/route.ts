import { and, count, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { products, stockMovements, transactionItems, transactions } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreAccess, requireStoreRole } from "@/src/lib/auth";
import { errorResponse, paginatedResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { getPagination, parseJsonBody, paymentMethodSchema, uuidSchema } from "@/src/lib/validation";

const createTransactionSchema = z.object({
  storeId: uuidSchema,
  customerName: z.string().trim().optional().nullable(),
  paymentMethod: paymentMethodSchema,
  paidAmount: z.number().int().nonnegative(),
  items: z.array(z.object({ productId: uuidSchema, quantity: z.number().int().positive() })).min(1, "Transaksi wajib memiliki item"),
});

function invoiceNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `INV-${date}-${String(now.getTime()).slice(-6)}`;
}

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const url = new URL(request.url);
    const storeId = url.searchParams.get("storeId");
    if (!storeId) return errorResponse("storeId wajib diisi", "BAD_REQUEST", 400);
    uuidSchema.parse(storeId);
    await requireStoreAccess(user.id, storeId);
    const { page, limit, offset } = getPagination(url.searchParams);
    const conditions = [eq(transactions.storeId, storeId)];
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    if (startDate) conditions.push(gte(transactions.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(transactions.createdAt, new Date(`${endDate}T23:59:59.999Z`)));

    const where = and(...conditions);
    const data = await db.select().from(transactions).where(where).orderBy(desc(transactions.createdAt)).limit(limit).offset(offset);
    const [{ total }] = await db.select({ total: count() }).from(transactions).where(where);

    return paginatedResponse("Daftar transaksi berhasil diambil", data, {
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
    const body = await parseJsonBody(request, createTransactionSchema);
    await requireStoreRole(user.id, body.storeId, ["owner", "admin"]);

    const created = await db.transaction(async (tx) => {
      const requested = new Map<string, number>();
      for (const item of body.items) {
        requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity);
      }

      const productRows = await tx
        .select()
        .from(products)
        .where(and(eq(products.storeId, body.storeId), inArray(products.id, [...requested.keys()])));

      if (productRows.length !== requested.size) {
        throw new ApiError("Sebagian produk tidak ditemukan", "NOT_FOUND", 404);
      }

      let totalAmount = 0;
      const itemPayload = productRows.map((product) => {
        const quantity = requested.get(product.id) ?? 0;
        if (product.status !== "active") throw new ApiError(`Produk ${product.name} tidak aktif`, "BAD_REQUEST", 400);
        if (product.stock < quantity) throw new ApiError(`Stok produk ${product.name} tidak mencukupi`, "INSUFFICIENT_STOCK", 409);
        const subtotal = product.sellingPrice * quantity;
        totalAmount += subtotal;
        return {
          product,
          quantity,
          subtotal,
          unitPrice: product.sellingPrice,
        };
      });

      if (body.paidAmount < totalAmount) {
        throw new ApiError("Nominal pembayaran kurang dari total transaksi", "INVALID_PAYMENT", 400);
      }

      const [transaction] = await tx
        .insert(transactions)
        .values({
          storeId: body.storeId,
          invoiceNumber: invoiceNumber(),
          customerName: body.customerName ?? null,
          totalAmount,
          paidAmount: body.paidAmount,
          changeAmount: body.paidAmount - totalAmount,
          paymentMethod: body.paymentMethod,
          status: "completed",
          createdBy: user.id,
        })
        .returning();

      await tx.insert(transactionItems).values(
        itemPayload.map((item) => ({
          transactionId: transaction.id,
          productId: item.product.id,
          supplierId: item.product.supplierId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      );

      for (const item of itemPayload) {
        const currentStock = item.product.stock - item.quantity;
        await tx
          .update(products)
          .set({ stock: currentStock, status: currentStock === 0 ? "out_of_stock" : item.product.status, updatedAt: new Date() })
          .where(eq(products.id, item.product.id));
        await tx.insert(stockMovements).values({
          storeId: body.storeId,
          productId: item.product.id,
          type: "sale",
          quantity: item.quantity,
          previousStock: item.product.stock,
          currentStock,
          notes: `Penjualan ${transaction.invoiceNumber}`,
          createdBy: user.id,
        });
      }

      return transaction;
    });

    return successResponse("Transaksi berhasil dibuat", created, 201);
  } catch (error) {
    return routeError(error);
  }
}
