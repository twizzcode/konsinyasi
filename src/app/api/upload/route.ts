import { requireAuth, requireStoreRole } from "@/src/lib/auth";
import { errorResponse, successResponse } from "@/src/lib/response";
import { routeError } from "@/src/lib/routes";
import { uploadFileToStorage, validateImageFile } from "@/src/lib/supabase";
import { uuidSchema } from "@/src/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "products");
    const storeId = formData.get("storeId");

    if (!storeId || typeof storeId !== "string") return errorResponse("storeId wajib diisi", "BAD_REQUEST", 400);
    uuidSchema.parse(storeId);
    await requireStoreRole(user.id, storeId, ["owner", "admin"]);
    if (!(file instanceof File)) return errorResponse("File wajib diisi", "BAD_REQUEST", 400);

    const validation = validateImageFile(file);
    if (!validation.ok) return errorResponse(validation.message, validation.code, validation.code === "FILE_TOO_LARGE" ? 413 : 400);

    const uploaded = await uploadFileToStorage(file, folder);
    return successResponse("File berhasil diupload", uploaded, 201);
  } catch (error) {
    return routeError(error);
  }
}
