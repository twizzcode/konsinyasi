module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/router.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiRouter",
    ()=>ApiRouter,
    "createPreflightResponse",
    ()=>createPreflightResponse,
    "getCorsHeaders",
    ()=>getCorsHeaders,
    "hasDisallowedOrigin",
    ()=>hasDisallowedOrigin
]);
class ResponseBuilder {
    statusCode = 200;
    payload = null;
    status(code) {
        this.statusCode = code;
        return this;
    }
    json(payload) {
        this.payload = payload;
        return this;
    }
    toResponse(headers) {
        return Response.json(this.payload, {
            status: this.statusCode,
            headers
        });
    }
}
const allowedOrigins = (process.env.CORS_ORIGIN ?? '').split(',').map((origin)=>origin.trim()).filter(Boolean);
const routeMatches = (routeSegments, pathSegments)=>{
    if (routeSegments.length !== pathSegments.length) {
        return null;
    }
    const params = {};
    for(let index = 0; index < routeSegments.length; index += 1){
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
const parseRequestBody = async (request)=>{
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
    return JSON.parse(bodyText);
};
const getCorsHeaders = (request)=>{
    const headers = new Headers({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    const origin = request.headers.get('origin');
    if (!origin) {
        return headers;
    }
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.set('Vary', 'Origin');
    }
    return headers;
};
const hasDisallowedOrigin = (request)=>{
    const origin = request.headers.get('origin');
    return Boolean(origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin));
};
const createPreflightResponse = (request)=>new Response(null, {
        status: 204,
        headers: getCorsHeaders(request)
    });
class ApiRouter {
    routes = [];
    get(path, handler) {
        this.add('GET', path, handler);
    }
    post(path, handler) {
        this.add('POST', path, handler);
    }
    put(path, handler) {
        this.add('PUT', path, handler);
    }
    delete(path, handler) {
        this.add('DELETE', path, handler);
    }
    add(method, path, handler) {
        this.routes.push({
            method,
            path,
            segments: path.split('/').filter(Boolean),
            handler
        });
    }
    async handle(request, pathname) {
        if (hasDisallowedOrigin(request)) {
            return Response.json({
                message: `Origin ${request.headers.get('origin')} is not allowed by CORS`
            }, {
                status: 403,
                headers: getCorsHeaders(request)
            });
        }
        const pathSegments = pathname.split('/').filter(Boolean);
        const route = this.routes.find((candidate)=>{
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
                url
            }, response);
            return response.toResponse(getCorsHeaders(request));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Internal server error';
            return Response.json({
                message
            }, {
                status: 500,
                headers: getCorsHeaders(request)
            });
        }
    }
}
}),
"[project]/src/db/schema/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "account",
    ()=>account,
    "accountsRelations",
    ()=>accountsRelations,
    "session",
    ()=>session,
    "sessionsRelations",
    ()=>sessionsRelations,
    "user",
    ()=>user,
    "usersRelations",
    ()=>usersRelations,
    "verification",
    ()=>verification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/relations.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/indexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
;
;
const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('user', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('name').notNull(),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('email').notNull().unique(),
    emailVerified: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])('email_verified').default(false).notNull(),
    image: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('image'),
    accountType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('account_type'),
    businessName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('business_name'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').defaultNow().notNull()
});
const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('session', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('expires_at').notNull(),
    token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('token').notNull().unique(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').defaultNow().notNull(),
    ipAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('ip_address'),
    userAgent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('user_agent'),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('user_id').notNull().references(()=>user.id, {
        onDelete: 'cascade'
    })
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('session_user_id_idx').on(table.userId)
    ]);
const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('account', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    accountId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('account_id').notNull(),
    providerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('provider_id').notNull(),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('user_id').notNull().references(()=>user.id, {
        onDelete: 'cascade'
    }),
    accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('access_token'),
    refreshToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('refresh_token'),
    idToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id_token'),
    accessTokenExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('access_token_expires_at'),
    refreshTokenExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('refresh_token_expires_at'),
    scope: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('scope'),
    password: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('password'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').defaultNow().notNull()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('account_user_id_idx').on(table.userId)
    ]);
const verification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('verification', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('id').primaryKey(),
    identifier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('identifier').notNull(),
    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('value').notNull(),
    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('expires_at').notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').defaultNow().notNull()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])('verification_identifier_idx').on(table.identifier)
    ]);
const usersRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(user, ({ many })=>({
        sessions: many(session),
        accounts: many(account)
    }));
const sessionsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(session, ({ one })=>({
        user: one(user, {
            fields: [
                session.userId
            ],
            references: [
                user.id
            ]
        })
    }));
const accountsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(account, ({ one })=>({
        user: one(user, {
            fields: [
                account.userId
            ],
            references: [
                user.id
            ]
        })
    }));
}),
"[project]/src/db/schema/app.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "consignedProducts",
    ()=>consignedProducts,
    "consignmentHistory",
    ()=>consignmentHistory,
    "salesTransactionItems",
    ()=>salesTransactionItems,
    "salesTransactions",
    ()=>salesTransactions,
    "stockAdditionHistory",
    ()=>stockAdditionHistory,
    "storeSuppliers",
    ()=>storeSuppliers,
    "supplierPayouts",
    ()=>supplierPayouts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/numeric.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/indexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/uuid.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/auth.ts [app-route] (ecmascript)");
;
;
const storeSuppliers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('store_suppliers', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').defaultRandom().primaryKey(),
    storeUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('store_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    supplierUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('supplier_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        withTimezone: true
    }).defaultNow().notNull()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueIndex"])('store_suppliers_store_supplier_unique').on(table.storeUserId, table.supplierUserId)
    ]);
const consignedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('consigned_products', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').defaultRandom().primaryKey(),
    storeUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('store_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    supplierUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('supplier_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('name').notNull(),
    imageUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('image_url'),
    sellPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('sell_price', {
        precision: 12,
        scale: 2
    }).notNull(),
    supplierPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('supplier_price', {
        precision: 12,
        scale: 2
    }).notNull(),
    initialQuantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('initial_quantity').default(0).notNull(),
    currentStock: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('current_stock').default(0).notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        withTimezone: true
    }).defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('updated_at', {
        withTimezone: true
    }).defaultNow().notNull()
});
const salesTransactions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('sales_transactions', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').defaultRandom().primaryKey(),
    code: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('code').notNull(),
    storeUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('store_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('status').default('Selesai').notNull(),
    totalAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('total_amount', {
        precision: 12,
        scale: 2
    }).default('0').notNull(),
    supplierAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('supplier_amount', {
        precision: 12,
        scale: 2
    }).default('0').notNull(),
    storeAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('store_amount', {
        precision: 12,
        scale: 2
    }).default('0').notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        withTimezone: true
    }).defaultNow().notNull()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueIndex"])('sales_transactions_code_unique').on(table.code)
    ]);
const salesTransactionItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('sales_transaction_items', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').defaultRandom().primaryKey(),
    transactionId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('transaction_id').references(()=>salesTransactions.id, {
        onDelete: 'cascade'
    }).notNull(),
    productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('product_id').references(()=>consignedProducts.id, {
        onDelete: 'restrict'
    }).notNull(),
    supplierUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('supplier_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    productName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('product_name').notNull(),
    supplierName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('supplier_name').notNull(),
    quantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('quantity').notNull(),
    unitPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('unit_price', {
        precision: 12,
        scale: 2
    }).notNull(),
    supplierUnitPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('supplier_unit_price', {
        precision: 12,
        scale: 2
    }).notNull(),
    totalPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('total_price', {
        precision: 12,
        scale: 2
    }).notNull(),
    supplierTotal: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('supplier_total', {
        precision: 12,
        scale: 2
    }).notNull(),
    storeTotal: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('store_total', {
        precision: 12,
        scale: 2
    }).notNull()
});
const supplierPayouts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('supplier_payouts', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').defaultRandom().primaryKey(),
    storeUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('store_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    supplierUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('supplier_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    amount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('amount', {
        precision: 12,
        scale: 2
    }).notNull(),
    note: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('note'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        withTimezone: true
    }).defaultNow().notNull()
});
const consignmentHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('consignment_history', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').defaultRandom().primaryKey(),
    storeUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('store_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    supplierUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('supplier_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('product_id').references(()=>consignedProducts.id, {
        onDelete: 'set null'
    }),
    productName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('product_name').notNull(),
    quantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('quantity').notNull(),
    sellPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('sell_price', {
        precision: 12,
        scale: 2
    }).notNull(),
    supplierPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["numeric"])('supplier_price', {
        precision: 12,
        scale: 2
    }).notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        withTimezone: true
    }).defaultNow().notNull()
});
const stockAdditionHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])('stock_addition_history', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('id').defaultRandom().primaryKey(),
    storeUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('store_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    supplierUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('supplier_user_id').references(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, {
        onDelete: 'cascade'
    }).notNull(),
    productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])('product_id').references(()=>consignedProducts.id, {
        onDelete: 'set null'
    }),
    productName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])('product_name').notNull(),
    quantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('quantity').notNull(),
    previousStock: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('previous_stock').notNull(),
    newStock: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])('new_stock').notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        withTimezone: true
    }).defaultNow().notNull()
});
}),
"[project]/src/db/schema/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/app.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/auth.ts [app-route] (ecmascript)");
;
;
}),
"[project]/src/db/schema/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "account",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["account"],
    "accountsRelations",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["accountsRelations"],
    "consignedProducts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"],
    "consignmentHistory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"],
    "salesTransactionItems",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"],
    "salesTransactions",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"],
    "session",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["session"],
    "sessionsRelations",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionsRelations"],
    "stockAdditionHistory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"],
    "storeSuppliers",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"],
    "supplierPayouts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"],
    "user",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"],
    "usersRelations",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["usersRelations"],
    "verification",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verification"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/db/schema/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/app.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/auth.ts [app-route] (ecmascript)");
}),
"[project]/src/db/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "db",
    ()=>db,
    "pool",
    ()=>pool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/node-postgres/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/db/schema/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/index.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
}
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["Pool"]({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') ? false : {
        rejectUnauthorized: false
    }
});
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])({
    client: pool,
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api-router.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "apiRouter",
    ()=>apiRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/config.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/router.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/db/schema/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/app.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema/auth.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const app = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiRouter"]();
const createTransactionCode = ()=>{
    const now = new Date();
    const pad = (value)=>String(value).padStart(2, '0');
    const stamp = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds())
    ].join('');
    const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `TRX-${stamp}-${suffix}`;
};
const ensureSupplierLinked = async (storeUserId, supplierUserId)=>{
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        supplierUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        businessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId, supplierUserId))).limit(1);
    return rows[0] ?? null;
};
const ensureStoreLinked = async (supplierUserId, storeUserId)=>{
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        storeUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        businessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId, supplierUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId, storeUserId))).limit(1);
    return rows[0] ?? null;
};
const getSupplierBalanceSummary = async (storeUserId, supplierUserId)=>{
    const [salesRows, payoutRows] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            supplierTotal: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].supplierTotal
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].transactionId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].supplierUserId, supplierUserId))),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].id,
            amount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].amount,
            note: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].note,
            createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].createdAt
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].supplierUserId, supplierUserId))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].createdAt))
    ]);
    const totalEarned = salesRows.reduce((sum, item)=>sum + Number(item.supplierTotal), 0);
    const totalPaidOut = payoutRows.reduce((sum, item)=>sum + Number(item.amount), 0);
    return {
        totalEarned,
        totalPaidOut,
        availableBalance: Math.max(0, totalEarned - totalPaidOut),
        payouts: payoutRows.map((item)=>({
                id: item.id,
                amount: Number(item.amount),
                note: item.note,
                createdAt: item.createdAt
            }))
    };
};
app.put('/api/users/:userId/profile', async (req, res)=>{
    const { userId } = req.params;
    const name = String(req.body?.name ?? '').trim();
    const businessName = String(req.body?.businessName ?? '').trim();
    const image = typeof req.body?.image === 'string' && req.body.image.trim().length > 0 ? req.body.image.trim() : null;
    if (!name || !businessName) {
        res.status(400).json({
            message: 'name and businessName are required'
        });
        return;
    }
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, userId)).limit(1);
    if (!existing[0]) {
        res.status(404).json({
            message: 'User not found'
        });
        return;
    }
    const [updated] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"]).set({
        name,
        businessName,
        image,
        updatedAt: new Date()
    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, userId)).returning({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        image: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].image,
        accountType: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].accountType,
        businessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    });
    res.json({
        data: updated
    });
});
app.get('/api/suppliers/search', async (req, res)=>{
    const query = String(req.query.q ?? '').trim();
    const storeUserId = String(req.query.storeUserId ?? '').trim();
    if (!query || !storeUserId) {
        res.json({
            data: []
        });
        return;
    }
    const results = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        businessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName,
        accountType: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].accountType
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].accountType, 'supplier'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["or"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ilike"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name, `%${query}%`), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ilike"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName, `%${query}%`), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ilike"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email, `%${query}%`)))).limit(10);
    const linked = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        supplierUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId, storeUserId));
    const linkedIds = new Set(linked.map((item)=>item.supplierUserId));
    res.json({
        data: results.map((item)=>({
                ...item,
                linked: linkedIds.has(item.id)
            }))
    });
});
app.get('/api/stores/:storeUserId/suppliers', async (req, res)=>{
    const { storeUserId } = req.params;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        linkId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].id,
        supplierUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        businessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId, storeUserId));
    res.json({
        data: rows
    });
});
app.get('/api/suppliers/:supplierUserId/stores', async (req, res)=>{
    const { supplierUserId } = req.params;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        linkId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].id,
        storeUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        businessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId, supplierUserId));
    res.json({
        data: rows
    });
});
app.get('/api/suppliers/:supplierUserId/overview', async (req, res)=>{
    const { supplierUserId } = req.params;
    const linkedStores = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        linkId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].id,
        storeUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        businessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId, supplierUserId));
    const storeIds = linkedStores.map((item)=>item.storeUserId);
    if (storeIds.length === 0) {
        res.json({
            data: {
                linkedStoreCount: 0,
                productCount: 0,
                currentStock: 0,
                availableBalance: 0,
                linkedStores: []
            }
        });
        return;
    }
    const [products, salesRows, payoutRows] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id,
            currentStock: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].currentStock
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId, supplierUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeIds))),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            supplierTotal: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].supplierTotal
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].transactionId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].supplierUserId, supplierUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].storeUserId, storeIds))),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            amount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].amount
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].supplierUserId, supplierUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"].storeUserId, storeIds)))
    ]);
    const totalEarned = salesRows.reduce((sum, item)=>sum + Number(item.supplierTotal), 0);
    const totalPaidOut = payoutRows.reduce((sum, item)=>sum + Number(item.amount), 0);
    res.json({
        data: {
            linkedStoreCount: linkedStores.length,
            productCount: products.length,
            currentStock: products.reduce((sum, item)=>sum + Number(item.currentStock), 0),
            availableBalance: Math.max(0, totalEarned - totalPaidOut),
            linkedStores
        }
    });
});
app.get('/api/suppliers/:supplierUserId/stores/:storeUserId/products', async (req, res)=>{
    const { supplierUserId, storeUserId } = req.params;
    const store = await ensureStoreLinked(supplierUserId, storeUserId);
    if (!store) {
        res.status(404).json({
            message: 'Store not found'
        });
        return;
    }
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].name,
        imageUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].imageUrl,
        sellPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].sellPrice,
        supplierPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierPrice,
        initialQuantity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].initialQuantity,
        currentStock: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].currentStock,
        createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].createdAt,
        updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].updatedAt
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId, supplierUserId)));
    res.json({
        data: rows
    });
});
app.get('/api/suppliers/:supplierUserId/stores/:storeUserId/balance', async (req, res)=>{
    const { supplierUserId, storeUserId } = req.params;
    const store = await ensureStoreLinked(supplierUserId, storeUserId);
    if (!store) {
        res.status(404).json({
            message: 'Store not found'
        });
        return;
    }
    const summary = await getSupplierBalanceSummary(storeUserId, supplierUserId);
    res.json({
        data: {
            supplier: {
                supplierUserId,
                name: '',
                email: '',
                businessName: null
            },
            ...summary
        }
    });
});
app.get('/api/suppliers/:supplierUserId/stores/:storeUserId/history', async (req, res)=>{
    const { supplierUserId, storeUserId } = req.params;
    const store = await ensureStoreLinked(supplierUserId, storeUserId);
    if (!store) {
        res.status(404).json({
            message: 'Store not found'
        });
        return;
    }
    const [consignments, stockAdditions] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"].supplierUserId, supplierUserId))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"].createdAt)),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"].supplierUserId, supplierUserId))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"].createdAt))
    ]);
    res.json({
        data: {
            supplier: {
                supplierUserId,
                name: '',
                email: '',
                businessName: null
            },
            stockEntries: [
                ...consignments.map((item)=>({
                        id: item.id,
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        type: 'consignment',
                        label: 'Titip awal',
                        sellPrice: Number(item.sellPrice),
                        supplierPrice: Number(item.supplierPrice),
                        previousStock: null,
                        newStock: item.quantity,
                        createdAt: item.createdAt
                    })),
                ...stockAdditions.map((item)=>({
                        id: item.id,
                        productId: item.productId,
                        productName: item.productName,
                        quantity: Math.abs(item.quantity),
                        type: item.quantity >= 0 ? 'restock' : 'withdrawal',
                        label: item.quantity >= 0 ? 'Tambah stok' : 'Ambil kembali',
                        sellPrice: null,
                        supplierPrice: null,
                        previousStock: item.previousStock,
                        newStock: item.newStock,
                        createdAt: item.createdAt
                    }))
            ].sort((left, right)=>new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        }
    });
});
app.get('/api/stores/:storeUserId/products', async (req, res)=>{
    const { storeUserId } = req.params;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id,
        supplierUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].name,
        imageUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].imageUrl,
        sellPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].sellPrice,
        supplierPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierPrice,
        initialQuantity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].initialQuantity,
        currentStock: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].currentStock,
        createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].createdAt,
        updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].updatedAt,
        supplierName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        supplierEmail: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        supplierBusinessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId));
    res.json({
        data: rows
    });
});
app.get('/api/stores/:storeUserId/products/:productId', async (req, res)=>{
    const { storeUserId, productId } = req.params;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id,
        supplierUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].name,
        imageUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].imageUrl,
        sellPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].sellPrice,
        supplierPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierPrice,
        initialQuantity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].initialQuantity,
        currentStock: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].currentStock,
        createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].createdAt,
        updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].updatedAt,
        supplierName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        supplierEmail: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].email,
        supplierBusinessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId))).limit(1);
    const product = rows[0];
    if (!product) {
        res.status(404).json({
            message: 'Product not found'
        });
        return;
    }
    res.json({
        data: product
    });
});
app.get('/api/stores/:storeUserId/transactions', async (req, res)=>{
    const { storeUserId } = req.params;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].storeUserId, storeUserId)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].createdAt));
    if (rows.length === 0) {
        res.json({
            data: []
        });
        return;
    }
    const items = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        transactionId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].transactionId,
        quantity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].quantity
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].transactionId, rows.map((item)=>item.id)));
    const quantityMap = new Map();
    for (const item of items){
        quantityMap.set(item.transactionId, (quantityMap.get(item.transactionId) ?? 0) + item.quantity);
    }
    res.json({
        data: rows.map((item)=>({
                ...item,
                itemCount: quantityMap.get(item.id) ?? 0
            }))
    });
});
app.get('/api/stores/:storeUserId/transactions/:transactionId', async (req, res)=>{
    const { storeUserId, transactionId } = req.params;
    const transactionRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].id, transactionId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].storeUserId, storeUserId))).limit(1);
    const transaction = transactionRows[0];
    if (!transaction) {
        res.status(404).json({
            message: 'Transaction not found'
        });
        return;
    }
    const items = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].transactionId, transactionId));
    res.json({
        data: {
            ...transaction,
            items
        }
    });
});
app.get('/api/stores/:storeUserId/reports/overview', async (req, res)=>{
    const { storeUserId } = req.params;
    const [transactions, suppliers, products] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].storeUserId, storeUserId)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].createdAt)),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            supplierUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId, storeUserId)),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id,
            currentStock: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].currentStock
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId))
    ]);
    const transactionIds = transactions.map((item)=>item.id);
    const items = transactionIds.length === 0 ? [] : await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        transactionId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].transactionId,
        quantity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].quantity
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].transactionId, transactionIds));
    const soldItems = items.reduce((sum, item)=>sum + item.quantity, 0);
    const currentStock = products.reduce((sum, item)=>sum + item.currentStock, 0);
    res.json({
        data: {
            transactionCount: transactions.length,
            totalSales: transactions.reduce((sum, item)=>sum + Number(item.totalAmount), 0),
            supplierAmount: transactions.reduce((sum, item)=>sum + Number(item.supplierAmount), 0),
            storeAmount: transactions.reduce((sum, item)=>sum + Number(item.storeAmount), 0),
            soldItems,
            supplierCount: suppliers.length,
            productCount: products.length,
            currentStock,
            recentTransactions: transactions.slice(0, 6)
        }
    });
});
app.get('/api/stores/:storeUserId/reports/suppliers/:supplierUserId', async (req, res)=>{
    const { storeUserId, supplierUserId } = req.params;
    const supplier = await ensureSupplierLinked(storeUserId, supplierUserId);
    if (!supplier) {
        res.status(404).json({
            message: 'Supplier not found'
        });
        return;
    }
    const productRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id,
        currentStock: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].currentStock,
        initialQuantity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].initialQuantity
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId, supplierUserId)));
    const transactionRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        transactionId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].id,
        code: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].code,
        createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].createdAt,
        itemId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].id,
        quantity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].quantity,
        totalPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].totalPrice,
        supplierTotal: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].supplierTotal,
        storeTotal: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].storeTotal
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].transactionId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"].supplierUserId, supplierUserId))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"].createdAt));
    const rows = transactionRows.map((item)=>({
            id: item.transactionId,
            code: item.code,
            createdAt: item.createdAt,
            quantity: item.quantity,
            revenue: Number(item.totalPrice),
            supplierAmount: Number(item.supplierTotal),
            storeAmount: Number(item.storeTotal)
        }));
    const balance = await getSupplierBalanceSummary(storeUserId, supplierUserId);
    res.json({
        data: {
            supplier,
            productCount: productRows.length,
            soldItems: rows.reduce((sum, item)=>sum + item.quantity, 0),
            currentStock: productRows.reduce((sum, item)=>sum + item.currentStock, 0),
            totalSales: rows.reduce((sum, item)=>sum + item.revenue, 0),
            supplierAmount: rows.reduce((sum, item)=>sum + item.supplierAmount, 0),
            storeAmount: rows.reduce((sum, item)=>sum + item.storeAmount, 0),
            paidOutAmount: balance.totalPaidOut,
            availableBalance: balance.availableBalance,
            transactions: rows
        }
    });
});
app.get('/api/stores/:storeUserId/suppliers/:supplierUserId/balance', async (req, res)=>{
    const { storeUserId, supplierUserId } = req.params;
    const supplier = await ensureSupplierLinked(storeUserId, supplierUserId);
    if (!supplier) {
        res.status(404).json({
            message: 'Supplier not found'
        });
        return;
    }
    const summary = await getSupplierBalanceSummary(storeUserId, supplierUserId);
    res.json({
        data: {
            supplier,
            ...summary
        }
    });
});
app.get('/api/stores/:storeUserId/suppliers/:supplierUserId/history', async (req, res)=>{
    const { storeUserId, supplierUserId } = req.params;
    const supplier = await ensureSupplierLinked(storeUserId, supplierUserId);
    if (!supplier) {
        res.status(404).json({
            message: 'Supplier not found'
        });
        return;
    }
    const [consignments, stockAdditions] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"].supplierUserId, supplierUserId))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"].createdAt)),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"].supplierUserId, supplierUserId))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"].createdAt))
    ]);
    res.json({
        data: {
            supplier,
            stockEntries: [
                ...consignments.map((item)=>({
                        id: item.id,
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        type: 'consignment',
                        label: 'Titip awal',
                        sellPrice: Number(item.sellPrice),
                        supplierPrice: Number(item.supplierPrice),
                        previousStock: null,
                        newStock: item.quantity,
                        createdAt: item.createdAt
                    })),
                ...stockAdditions.map((item)=>({
                        id: item.id,
                        productId: item.productId,
                        productName: item.productName,
                        quantity: Math.abs(item.quantity),
                        type: item.quantity >= 0 ? 'restock' : 'withdrawal',
                        label: item.quantity >= 0 ? 'Tambah stok' : 'Ambil kembali',
                        sellPrice: null,
                        supplierPrice: null,
                        previousStock: item.previousStock,
                        newStock: item.newStock,
                        createdAt: item.createdAt
                    }))
            ].sort((left, right)=>new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        }
    });
});
app.get('/api/stores/:storeUserId/suppliers/:supplierUserId/products', async (req, res)=>{
    const { storeUserId, supplierUserId } = req.params;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].name,
        imageUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].imageUrl,
        sellPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].sellPrice,
        supplierPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierPrice,
        initialQuantity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].initialQuantity,
        currentStock: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].currentStock,
        createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].createdAt,
        updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].updatedAt
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId, supplierUserId)));
    res.json({
        data: rows
    });
});
app.post('/api/stores/:storeUserId/suppliers', async (req, res)=>{
    const { storeUserId } = req.params;
    const supplierUserId = String(req.body?.supplierUserId ?? '').trim();
    if (!supplierUserId) {
        res.status(400).json({
            message: 'supplierUserId is required'
        });
        return;
    }
    const [storeUser, supplierUser] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, storeUserId)).limit(1),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, supplierUserId)).limit(1)
    ]);
    if (!storeUser[0] || storeUser[0].accountType !== 'store') {
        res.status(400).json({
            message: 'Store account not found'
        });
        return;
    }
    if (!supplierUser[0] || supplierUser[0].accountType !== 'supplier') {
        res.status(400).json({
            message: 'Supplier account not found'
        });
        return;
    }
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].id
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId, supplierUserId))).limit(1);
    if (!existing[0]) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).values({
            storeUserId,
            supplierUserId
        });
    }
    res.status(201).json({
        success: true
    });
});
app.post('/api/stores/:storeUserId/suppliers/:supplierUserId/products', async (req, res)=>{
    const { storeUserId, supplierUserId } = req.params;
    const name = String(req.body?.name ?? '').trim();
    const imageUrl = typeof req.body?.imageUrl === 'string' && req.body.imageUrl.trim().length > 0 ? req.body.imageUrl.trim() : null;
    const sellPrice = Number(req.body?.sellPrice ?? 0);
    const supplierPrice = Number(req.body?.supplierPrice ?? 0);
    const quantity = Number(req.body?.quantity ?? 0);
    if (!name || !sellPrice || quantity <= 0) {
        res.status(400).json({
            message: 'name, sellPrice, and quantity are required'
        });
        return;
    }
    const linked = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].id
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeSuppliers"].supplierUserId, supplierUserId))).limit(1);
    if (!linked[0]) {
        res.status(400).json({
            message: 'Supplier is not linked to this store'
        });
        return;
    }
    const [created] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).values({
        storeUserId,
        supplierUserId,
        name,
        imageUrl,
        sellPrice: String(sellPrice),
        supplierPrice: String(supplierPrice),
        initialQuantity: quantity,
        currentStock: quantity
    }).returning();
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignmentHistory"]).values({
        storeUserId,
        supplierUserId,
        productId: created.id,
        productName: name,
        quantity,
        sellPrice: String(sellPrice),
        supplierPrice: String(supplierPrice)
    });
    res.status(201).json({
        data: created
    });
});
app.put('/api/stores/:storeUserId/suppliers/:supplierUserId/products/:productId', async (req, res)=>{
    const { storeUserId, supplierUserId, productId } = req.params;
    const name = String(req.body?.name ?? '').trim();
    const imageUrl = typeof req.body?.imageUrl === 'string' && req.body.imageUrl.trim().length > 0 ? req.body.imageUrl.trim() : null;
    const sellPrice = Number(req.body?.sellPrice ?? 0);
    const supplierPrice = Number(req.body?.supplierPrice ?? 0);
    const quantity = Number(req.body?.quantity ?? 0);
    const currentStock = Number(req.body?.currentStock ?? quantity);
    if (!name || !sellPrice || quantity <= 0 || currentStock < 0 || currentStock > quantity) {
        res.status(400).json({
            message: 'name, sellPrice, quantity, and valid currentStock are required'
        });
        return;
    }
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId, supplierUserId))).limit(1);
    if (!existing[0]) {
        res.status(404).json({
            message: 'Product not found'
        });
        return;
    }
    const [updated] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).set({
        name,
        imageUrl,
        sellPrice: String(sellPrice),
        supplierPrice: String(supplierPrice),
        initialQuantity: quantity,
        currentStock,
        updatedAt: new Date()
    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId)).returning();
    res.json({
        data: updated
    });
});
app.post('/api/stores/:storeUserId/suppliers/:supplierUserId/products/:productId/add-stock', async (req, res)=>{
    const { storeUserId, supplierUserId, productId } = req.params;
    const quantity = Number(req.body?.quantity ?? 0);
    if (quantity <= 0) {
        res.status(400).json({
            message: 'quantity must be greater than 0'
        });
        return;
    }
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId, supplierUserId))).limit(1);
    const product = existing[0];
    if (!product) {
        res.status(404).json({
            message: 'Product not found'
        });
        return;
    }
    const [updated] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).set({
        initialQuantity: product.initialQuantity + quantity,
        currentStock: product.currentStock + quantity,
        updatedAt: new Date()
    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId)).returning();
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"]).values({
        storeUserId,
        supplierUserId,
        productId: product.id,
        productName: product.name,
        quantity,
        previousStock: product.currentStock,
        newStock: updated.currentStock
    });
    res.json({
        data: updated
    });
});
app.post('/api/stores/:storeUserId/suppliers/:supplierUserId/products/:productId/remove-stock', async (req, res)=>{
    const { storeUserId, supplierUserId, productId } = req.params;
    const quantity = Number(req.body?.quantity ?? 0);
    if (quantity <= 0) {
        res.status(400).json({
            message: 'quantity must be greater than 0'
        });
        return;
    }
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId, supplierUserId))).limit(1);
    const product = existing[0];
    if (!product) {
        res.status(404).json({
            message: 'Product not found'
        });
        return;
    }
    if (quantity > product.currentStock) {
        res.status(400).json({
            message: 'quantity exceeds current stock'
        });
        return;
    }
    const [updated] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).set({
        initialQuantity: product.initialQuantity - quantity,
        currentStock: product.currentStock - quantity,
        updatedAt: new Date()
    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId)).returning();
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stockAdditionHistory"]).values({
        storeUserId,
        supplierUserId,
        productId: product.id,
        productName: product.name,
        quantity: -quantity,
        previousStock: product.currentStock,
        newStock: updated.currentStock
    });
    res.json({
        data: updated
    });
});
app.post('/api/stores/:storeUserId/suppliers/:supplierUserId/payouts', async (req, res)=>{
    const { storeUserId, supplierUserId } = req.params;
    const amount = Number(req.body?.amount ?? 0);
    const note = typeof req.body?.note === 'string' && req.body.note.trim().length > 0 ? req.body.note.trim() : null;
    if (amount <= 0) {
        res.status(400).json({
            message: 'amount must be greater than 0'
        });
        return;
    }
    const supplier = await ensureSupplierLinked(storeUserId, supplierUserId);
    if (!supplier) {
        res.status(404).json({
            message: 'Supplier not found'
        });
        return;
    }
    const balance = await getSupplierBalanceSummary(storeUserId, supplierUserId);
    if (amount > balance.availableBalance) {
        res.status(400).json({
            message: 'amount exceeds available supplier balance'
        });
        return;
    }
    const [created] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supplierPayouts"]).values({
        storeUserId,
        supplierUserId,
        amount: String(amount),
        note
    }).returning();
    const updatedBalance = await getSupplierBalanceSummary(storeUserId, supplierUserId);
    res.status(201).json({
        data: {
            payout: {
                id: created.id,
                amount: Number(created.amount),
                note: created.note,
                createdAt: created.createdAt
            },
            availableBalance: updatedBalance.availableBalance,
            totalPaidOut: updatedBalance.totalPaidOut
        }
    });
});
app.post('/api/stores/:storeUserId/transactions', async (req, res)=>{
    const { storeUserId } = req.params;
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (items.length === 0) {
        res.status(400).json({
            message: 'items are required'
        });
        return;
    }
    const normalizedItems = items.map((item)=>({
            productId: String(item?.productId ?? '').trim(),
            quantity: Number(item?.quantity ?? 0)
        })).filter((item)=>item.productId && item.quantity > 0);
    if (normalizedItems.length === 0) {
        res.status(400).json({
            message: 'items are invalid'
        });
        return;
    }
    const quantities = new Map();
    for (const item of normalizedItems){
        quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }
    const productIds = Array.from(quantities.keys());
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id,
        supplierUserId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].name,
        currentStock: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].currentStock,
        sellPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].sellPrice,
        supplierPrice: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierPrice,
        supplierName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].name,
        supplierBusinessName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].businessName
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["user"].id, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productIds)));
    if (products.length !== productIds.length) {
        res.status(400).json({
            message: 'Some products are not available for this store'
        });
        return;
    }
    for (const product of products){
        const soldQuantity = quantities.get(product.id) ?? 0;
        if (soldQuantity > product.currentStock) {
            res.status(400).json({
                message: `Stock for ${product.name} is not enough`
            });
            return;
        }
    }
    const code = createTransactionCode();
    const lineItems = products.map((product)=>{
        const quantity = quantities.get(product.id) ?? 0;
        const unitPrice = Number(product.sellPrice);
        const supplierUnitPrice = Number(product.supplierPrice);
        const totalPrice = unitPrice * quantity;
        const supplierTotal = supplierUnitPrice * quantity;
        const storeTotal = totalPrice - supplierTotal;
        return {
            productId: product.id,
            supplierUserId: product.supplierUserId,
            productName: product.name,
            supplierName: product.supplierBusinessName || product.supplierName,
            quantity,
            unitPrice,
            supplierUnitPrice,
            totalPrice,
            supplierTotal,
            storeTotal
        };
    });
    const totalAmount = lineItems.reduce((sum, item)=>sum + item.totalPrice, 0);
    const supplierAmount = lineItems.reduce((sum, item)=>sum + item.supplierTotal, 0);
    const storeAmount = lineItems.reduce((sum, item)=>sum + item.storeTotal, 0);
    const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].transaction(async (tx)=>{
        const [transaction] = await tx.insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactions"]).values({
            code,
            storeUserId,
            totalAmount: String(totalAmount),
            supplierAmount: String(supplierAmount),
            storeAmount: String(storeAmount)
        }).returning();
        await tx.insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["salesTransactionItems"]).values(lineItems.map((item)=>({
                transactionId: transaction.id,
                productId: item.productId,
                supplierUserId: item.supplierUserId,
                productName: item.productName,
                supplierName: item.supplierName,
                quantity: item.quantity,
                unitPrice: String(item.unitPrice),
                supplierUnitPrice: String(item.supplierUnitPrice),
                totalPrice: String(item.totalPrice),
                supplierTotal: String(item.supplierTotal),
                storeTotal: String(item.storeTotal)
            })));
        await Promise.all(products.map((product)=>tx.update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).set({
                currentStock: product.currentStock - (quantities.get(product.id) ?? 0),
                updatedAt: new Date()
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, product.id))));
        return transaction;
    });
    res.status(201).json({
        data: created
    });
});
app.delete('/api/stores/:storeUserId/suppliers/:supplierUserId/products/:productId', async (req, res)=>{
    const { storeUserId, supplierUserId, productId } = req.params;
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].storeUserId, storeUserId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].supplierUserId, supplierUserId))).limit(1);
    if (!existing[0]) {
        res.status(404).json({
            message: 'Product not found'
        });
        return;
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2f$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consignedProducts"].id, productId));
    res.json({
        success: true
    });
});
const apiRouter = app;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/[...path]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "OPTIONS",
    ()=>OPTIONS,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api-router.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/router.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const runtime = 'nodejs';
const handle = async (request, context)=>{
    const { path } = await context.params;
    const pathname = `/api/${path.join('/')}`;
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiRouter"].handle(request, pathname);
    if (response) {
        return response;
    }
    return Response.json({
        message: 'Not found'
    }, {
        status: 404
    });
};
async function GET(request, context) {
    return handle(request, context);
}
async function POST(request, context) {
    return handle(request, context);
}
async function PUT(request, context) {
    return handle(request, context);
}
async function DELETE(request, context) {
    return handle(request, context);
}
async function OPTIONS(request) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createPreflightResponse"])(request);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0zed3-1._.js.map