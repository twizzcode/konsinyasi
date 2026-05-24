import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { emailSchema, parseJsonBody } from "@/src/lib/validation";

const syncUserSchema = z.object({
  clerkId: z.string().trim().optional().nullable(),
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: emailSchema,
  phone: z.string().trim().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request, syncUserSchema);
    const [existing] = await db
      .select()
      .from(users)
      .where(body.clerkId ? or(eq(users.clerkId, body.clerkId), eq(users.email, body.email)) : eq(users.email, body.email))
      .limit(1);

    const payload = {
      clerkId: body.clerkId ?? existing?.clerkId ?? null,
      name: body.name,
      email: body.email,
      phone: body.phone ?? existing?.phone ?? null,
      avatarUrl: body.avatarUrl ?? existing?.avatarUrl ?? null,
      updatedAt: new Date(),
    };

    const [user] = existing
      ? await db.update(users).set(payload).where(eq(users.id, existing.id)).returning()
      : await db.insert(users).values(payload).returning();

    return successResponse("User berhasil disinkronkan", user);
  } catch (error) {
    return routeError(error);
  }
}
