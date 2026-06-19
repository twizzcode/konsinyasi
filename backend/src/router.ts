type ApiHandler = (req: ApiRequest, res: ApiResponse) => Promise<void> | void;

type Route = {
  method: string;
  path: string;
  segments: string[];
  handler: ApiHandler;
};

export type ApiRequest = {
  body: any;
  method: string;
  params: Record<string, string>;
  query: Record<string, string>;
  request: Request;
  url: URL;
};

class ResponseBuilder {
  private statusCode = 200;

  private payload: unknown = null;

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(payload: unknown) {
    this.payload = payload;
    return this;
  }

  toResponse(headers: HeadersInit) {
    return Response.json(this.payload, {
      status: this.statusCode,
      headers,
    });
  }
}

export type ApiResponse = Pick<ResponseBuilder, 'status' | 'json'>;

const isDevelopment = process.env.NODE_ENV !== 'production';

const expoDevelopmentOrigins = isDevelopment
  ? [
    'exp://**',
    'exp://192.168.*.*:*',
    'exp://10.0.*.*:*',
    'exp://172.16.*.*:*',
    'exp://172.17.*.*:*',
    'exp://172.18.*.*:*',
    'exp://172.19.*.*:*',
    'exp://172.20.*.*:*',
    'exp://172.21.*.*:*',
    'exp://172.22.*.*:*',
    'exp://172.23.*.*:*',
    'exp://172.24.*.*:*',
    'exp://172.25.*.*:*',
    'exp://172.26.*.*:*',
    'exp://172.27.*.*:*',
    'exp://172.28.*.*:*',
    'exp://172.29.*.*:*',
    'exp://172.30.*.*:*',
    'exp://172.31.*.*:*',
  ]
  : [];

const allowedOrigins = [
  ...expoDevelopmentOrigins,
  ...(process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const normalizeOriginValue = (value: string) => value.replace(/\/+$/, '').replace(/\/\*\*$/, '');

const matchesOriginPattern = (origin: string, pattern: string) => {
  const normalizedOrigin = normalizeOriginValue(origin);
  const normalizedPattern = normalizeOriginValue(pattern);
  const escapedPattern = normalizedPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedPattern.replace(/\*/g, '.*')}$`);

  return regex.test(normalizedOrigin);
};

const isAllowedOrigin = (origin: string) =>
  allowedOrigins.length === 0 || allowedOrigins.some((pattern) => matchesOriginPattern(origin, pattern));

const routeMatches = (routeSegments: string[], pathSegments: string[]) => {
  if (routeSegments.length !== pathSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < routeSegments.length; index += 1) {
    const routeSegment = routeSegments[index];
    const pathSegment = pathSegments[index];

    if (routeSegment.startsWith(':')) {
      params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
      continue;
    }

    if (routeSegment !== pathSegment) {
      return null;
    }
  }

  return params;
};

const parseRequestBody = async (request: Request) => {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return undefined;
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined;
  }

  const bodyText = await request.text();
  if (!bodyText) {
    return undefined;
  }

  return JSON.parse(bodyText) as any;
};

export const getCorsHeaders = (request: Request) => {
  const headers = new Headers({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  });
  const origin = request.headers.get('origin');

  if (!origin) {
    return headers;
  }

  if (isAllowedOrigin(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }

  return headers;
};

export const hasDisallowedOrigin = (request: Request) => {
  const origin = request.headers.get('origin');
  return Boolean(origin && !isAllowedOrigin(origin));
};

export const createPreflightResponse = (request: Request) => new Response(null, {
  status: 204,
  headers: getCorsHeaders(request),
});

export class ApiRouter {
  private routes: Route[] = [];

  get(path: string, handler: ApiHandler) {
    this.add('GET', path, handler);
  }

  post(path: string, handler: ApiHandler) {
    this.add('POST', path, handler);
  }

  put(path: string, handler: ApiHandler) {
    this.add('PUT', path, handler);
  }

  delete(path: string, handler: ApiHandler) {
    this.add('DELETE', path, handler);
  }

  private add(method: string, path: string, handler: ApiHandler) {
    this.routes.push({
      method,
      path,
      segments: path.split('/').filter(Boolean),
      handler,
    });
  }

  async handle(request: Request, pathname: string) {
    if (hasDisallowedOrigin(request)) {
      return Response.json({ message: `Origin ${request.headers.get('origin')} is not allowed by CORS` }, {
        status: 403,
        headers: getCorsHeaders(request),
      });
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    const route = this.routes.find((candidate) => {
      if (candidate.method !== request.method) {
        return false;
      }

      return routeMatches(candidate.segments, pathSegments) !== null;
    });

    if (!route) {
      return null;
    }

    const params = routeMatches(route.segments, pathSegments) ?? {};
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const body = await parseRequestBody(request);
    const response = new ResponseBuilder();

    try {
      await route.handler({
        body,
        method: request.method,
        params,
        query,
        request,
        url,
      }, response);
      return response.toResponse(getCorsHeaders(request));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return Response.json({ message }, {
        status: 500,
        headers: getCorsHeaders(request),
      });
    }
  }
}
