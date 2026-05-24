import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { storeMembers, stores } from "@/src/db/schema";
import { ApiError, requireAuth, requireStoreRole } from "@/src/lib/auth";
import { successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { memberStatusSchema, parseJsonBody, roleSchema, uuidSchema } from "@/src/lib/validation";

const updateMemberSchema = z.object({
  role: roleSchema.optional(),
  status: memberStatusSchema.optional(),
});

type Ctx = { params: Promise<{ memberId: string }> };

async function findMember(memberId: string) {
  const [member] = await db.select().from(storeMembers).where(eq(storeMembers.id, memberId)).limit(1);
  if (!member) throw new ApiError("Member tidak ditemukan", "NOT_FOUND", 404);
  return member;
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const { memberId } = await ctx.params;
    uuidSchema.parse(memberId);
    const currentUser = await requireAuth(request);
    const member = await findMember(memberId);
    await requireStoreRole(currentUser.id, member.storeId, ["owner"]);
    const body = await parseJsonBody(request, updateMemberSchema);

    const [store] = await db.select().from(stores).where(eq(stores.id, member.storeId)).limit(1);
    if (member.userId === store?.ownerId && body.role && body.role !== "owner") {
      throw new ApiError("Owner utama tidak boleh diturunkan role-nya", "FORBIDDEN", 403);
    }

    const [updated] = await db
      .update(storeMembers)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(storeMembers.id, memberId))
      .returning();

    return successResponse("Member berhasil diperbarui", updated);
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const { memberId } = await ctx.params;
    uuidSchema.parse(memberId);
    const currentUser = await requireAuth(request);
    const member = await findMember(memberId);
    await requireStoreRole(currentUser.id, member.storeId, ["owner"]);

    const [store] = await db.select().from(stores).where(eq(stores.id, member.storeId)).limit(1);
    if (member.userId === store?.ownerId || member.role === "owner") {
      throw new ApiError("Owner tidak boleh dihapus dari toko", "FORBIDDEN", 403);
    }

    const [deleted] = await db.delete(storeMembers).where(eq(storeMembers.id, memberId)).returning();
    return successResponse("Member berhasil dihapus", deleted);
  } catch (error) {
    return routeError(error);
  }
}
