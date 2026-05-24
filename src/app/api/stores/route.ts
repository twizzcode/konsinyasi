import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { storeMembers, stores } from "@/src/db/schema";
import { requireAuth } from "@/src/lib/auth";
import { paginatedResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { getPagination, parseJsonBody } from "@/src/lib/validation";

const createStoreSchema = z.object({
  name: z.string().trim().min(1, "Nama toko wajib diisi"),
  description: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const url = new URL(request.url);
    const { page, limit, offset } = getPagination(url.searchParams);

    const where = and(eq(storeMembers.userId, user.id), eq(storeMembers.status, "active"));
    const rows = await db
      .select({ store: stores, member: storeMembers })
      .from(storeMembers)
      .innerJoin(stores, eq(stores.id, storeMembers.storeId))
      .where(where)
      .orderBy(desc(stores.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(storeMembers).where(where);

    return paginatedResponse(
      "Daftar toko berhasil diambil",
      rows.map(({ store, member }) => ({ ...store, role: member.role, membershipStatus: member.status })),
      { page, limit, total, totalPages: Math.ceil(total / limit) },
    );
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = await parseJsonBody(request, createStoreSchema);

    const [store] = await db.transaction(async (tx) => {
      const [createdStore] = await tx
        .insert(stores)
        .values({
          ownerId: user.id,
          name: body.name,
          description: body.description ?? null,
          address: body.address ?? null,
          phone: body.phone ?? null,
        })
        .returning();

      await tx.insert(storeMembers).values({
        storeId: createdStore.id,
        userId: user.id,
        role: "owner",
        status: "active",
      });

      return [createdStore];
    });

    return successResponse("Toko berhasil dibuat", store, 201);
  } catch (error) {
    return routeError(error);
  }
}
