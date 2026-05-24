import { createClient } from "@supabase/supabase-js";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase URL atau service role key belum dikonfigurasi");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false as const, code: "INVALID_FILE_TYPE" as const, message: "Format file gambar tidak valid" };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { ok: false as const, code: "FILE_TOO_LARGE" as const, message: "Ukuran file maksimal 2 MB" };
  }

  return { ok: true as const };
}

export function getPublicFileUrl(path: string) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";
  const client = createSupabaseAdminClient();
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function uploadFileToStorage(file: File, folder = "products") {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";
  const client = createSupabaseAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const cleanFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "") || "products";
  const path = `${cleanFolder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await client.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    path,
    url: getPublicFileUrl(path),
  };
}
