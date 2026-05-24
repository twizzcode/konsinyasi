import { and, eq } from "drizzle-orm";
import { db } from "@/src/db";
import { storeMembers, users } from "@/src/db/schema";
import type { StoreMember, User } from "@/src/db/schema";
import type { StoreRole } from "@/src/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public code:
      | "BAD_REQUEST"
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "VALIDATION_ERROR"
      | "INVALID_ROLE"
      | "DUPLICATE_DATA"
      | "INSUFFICIENT_STOCK"
      | "INVALID_PAYMENT",
    public status: number,
  ) {
    super(message);
  }
}

export async function getCurrentUser(request: Request): Promise<User | null> {
  const userId = request.headers.get("x-user-id");
  const clerkId = request.headers.get("x-clerk-id");

  if (!userId && !clerkId) return null;

  const where = userId ? eq(users.id, userId) : eq(users.clerkId, clerkId ?? "");
  const [user] = await db.select().from(users).where(where).limit(1);
  return user ?? null;
}

export async function requireAuth(request: Request): Promise<User> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new ApiError("User belum terautentikasi", "UNAUTHORIZED", 401);
  }
  return user;
}

export async function requireStoreAccess(userId: string, storeId: string): Promise<StoreMember> {
  const [member] = await db
    .select()
    .from(storeMembers)
    .where(and(eq(storeMembers.storeId, storeId), eq(storeMembers.userId, userId), eq(storeMembers.status, "active")))
    .limit(1);

  if (!member) {
    throw new ApiError("User tidak memiliki akses ke toko ini", "FORBIDDEN", 403);
  }

  return member;
}

export async function requireStoreRole(userId: string, storeId: string, allowedRoles: StoreRole[]) {
  const member = await requireStoreAccess(userId, storeId);
  if (!allowedRoles.includes(member.role as StoreRole)) {
    throw new ApiError("Role user tidak memiliki izin", "FORBIDDEN", 403);
  }
  return member;
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return { message: error.message, code: error.code, status: error.status };
  }
  return null;
}
