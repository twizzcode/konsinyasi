import { ZodError } from "zod";
import { errorResponse, internalErrorResponse } from "./response";
import { formatZodError } from "./validation";
import { handleApiError } from "./auth";

export function routeError(error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse(formatZodError(error), "VALIDATION_ERROR", 422);
  }

  const apiError = handleApiError(error);
  if (apiError) {
    return errorResponse(apiError.message, apiError.code, apiError.status);
  }

  return internalErrorResponse(error);
}
