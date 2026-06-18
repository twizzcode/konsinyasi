import { env } from '@/lib/env';
import { getSupabaseClient } from '@/lib/supabase';

interface UploadProductImageOptions {
  fileUri: string;
  fileName?: string;
  contentType?: string;
  bucket?: string;
  folder?: string;
  upsert?: boolean;
}

const buildFilePath = (folder: string | undefined, fileName: string) =>
  folder ? `${folder.replace(/\/+$/, '')}/${fileName}` : fileName;

const stripLeadingSlash = (value: string) => value.replace(/^\/+/, '');

const getBucketName = (bucket = env.storageBucket) => bucket;

export async function uploadProductImage({
  fileUri,
  fileName = `${Date.now()}.jpg`,
  contentType = 'image/jpeg',
  bucket = env.storageBucket,
  folder,
  upsert = false,
}: UploadProductImageOptions) {
  const client = getSupabaseClient();
  const response = await fetch(fileUri);
  const arrayBuffer = await response.arrayBuffer();
  const path = buildFilePath(folder, fileName);

  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType, upsert });

  if (error) throw error;

  const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(data.path);

  return {
    ...data,
    publicUrl: publicUrlData.publicUrl,
  };
}

export async function uploadImageAsset({
  fileUri,
  fileName = `${Date.now()}.jpg`,
  contentType = 'image/jpeg',
  bucket = env.storageBucket,
  folder,
  upsert = false,
}: UploadProductImageOptions) {
  return uploadProductImage({
    fileUri,
    fileName,
    contentType,
    bucket,
    folder,
    upsert,
  });
}

export function getStoragePathFromPublicUrl(publicUrl: string, bucket = env.storageBucket) {
  const marker = `/storage/v1/object/public/${getBucketName(bucket)}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return stripLeadingSlash(decodeURIComponent(publicUrl.slice(index + marker.length)));
}

export async function removeStorageFileByPublicUrl(publicUrl: string, bucket = env.storageBucket) {
  const path = getStoragePathFromPublicUrl(publicUrl, bucket);
  if (!path) return;

  const client = getSupabaseClient();
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) throw error;
}
