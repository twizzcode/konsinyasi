import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/src/auth';
import { createPreflightResponse, getCorsHeaders } from '@/src/router';

export const runtime = 'nodejs';

const handler = toNextJsHandler(auth);

const withCors = async (routeHandler: ((request: Request) => Promise<Response>) | undefined, request: Request) => {
  if (!routeHandler) {
    return Response.json({ message: 'Method not allowed' }, {
      status: 405,
      headers: getCorsHeaders(request),
    });
  }

  const response = await routeHandler(request);
  const corsHeaders = getCorsHeaders(request);
  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
};

export async function GET(request: Request) {
  return withCors(handler.GET, request);
}

export async function POST(request: Request) {
  return withCors(handler.POST, request);
}

export async function PUT(request: Request) {
  return withCors(handler.PUT, request);
}

export async function PATCH(request: Request) {
  return withCors(handler.PATCH, request);
}

export async function DELETE(request: Request) {
  return withCors(handler.DELETE, request);
}

export async function OPTIONS(request: Request) {
  return createPreflightResponse(request);
}
