import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { storeMembers, users } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreRole } from "@/src/lib/auth";
import { errorResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { parseJsonBody, roleSchema, uuidSchema } from "@/src/lib/validation";

const addMemberSchema = z.object({
  storeId: uuidSchema,
  userId: uuidSchema,
  role: roleSchema,
});

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const storeId = new URL(request.url).searchParams.get("storeId");
    if (!storeId) return errorResponse("storeId wajib diisi", "BAD_REQUEST", 400);
    uuidSchema.parse(storeId);
    await requireStoreRole(user.id, storeId, ["owner", "admin"]);

    const members = await db
      .select({ member: storeMembers, user: users })
      .from(storeMembers)
      .innerJoin(users, eq(users.id, storeMembers.userId))
      .where(eq(storeMembers.storeId, storeId));

    return successResponse("Daftar member berhasil diambil", members);
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireAuth(request);
    const body = await parseJsonBody(request, addMemberSchema);
    await requireStoreRole(currentUser.id, body.storeId, ["owner"]);

    const [existingUser] = await db.select().from(users).where(eq(users.id, body.userId)).limit(1);
    if (!existingUser) throw new ApiError("User tidak ditemukan", "NOT_FOUND", 404);

    const [existing] = await db
      .select()
      .from(storeMembers)
      .where(and(eq(storeMembers.storeId, body.storeId), eq(storeMembers.userId, body.userId)))
      .limit(1);
    if (existing) throw new ApiError("User sudah menjadi member toko", "DUPLICATE_DATA", 409);

    const [member] = await db.insert(storeMembers).values({ ...body, status: "active" }).returning();
    return successResponse("Member berhasil ditambahkan", member, 201);
  } catch (error) {
    return routeError(error);
  }
}
