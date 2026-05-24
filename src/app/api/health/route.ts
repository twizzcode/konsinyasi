import { successResponse } from "@/src/lib/response";

export async function GET() {
  return successResponse("KonsinyasiKu Backend API is running", { status: "ok" });
}
