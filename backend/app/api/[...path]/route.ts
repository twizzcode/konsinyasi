import { apiRouter } from '@/src/api-router';
import { createPreflightResponse } from '@/src/router';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const handle = async (request: Request, context: RouteContext) => {
  const { path } = await context.params;
  const pathname = `/api/${path.join('/')}`;
  const response = await apiRouter.handle(request, pathname);

  if (response) {
    return response;
  }

  return Response.json({ message: 'Not found' }, { status: 404 });
};

export async function GET(request: Request, context: RouteContext) {
  return handle(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handle(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handle(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handle(request, context);
}

export async function OPTIONS(request: Request) {
  return createPreflightResponse(request);
}
