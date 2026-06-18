import { getCorsHeaders } from '@/src/router';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  return Response.json({ status: 'ok' }, {
    headers: getCorsHeaders(request),
  });
}
