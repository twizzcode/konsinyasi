import type { ApiErrorCode } from "@/src/types";

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function successResponse<T>(message: string, data: T, status = 200) {
  return Response.json({ success: true, message, data }, { status });
}

export function paginatedResponse<T>(message: string, data: T[], meta: Meta, status = 200) {
  return Response.json({ success: true, message, data, meta }, { status });
}

export function errorResponse(message: string, error: ApiErrorCode, status = 400) {
  return Response.json({ success: false, message, error }, { status });
}

export function internalErrorResponse(error: unknown) {
  console.error(error);
  return errorResponse("Terjadi kesalahan pada server", "INTERNAL_SERVER_ERROR", 500);
}
