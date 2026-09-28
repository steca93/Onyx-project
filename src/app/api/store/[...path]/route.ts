import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { wcStoreApiUrl } from "@/lib/env/wordpress";

/**
 * Proxies the browser's cart/checkout calls to WooCommerce's Store API.
 * The browser only ever talks to same-origin `/api/store/*` — it never
 * sees the WordPress host, the real Cart-Token, or the CSRF nonce. Those
 * live in httpOnly cookies set here, never exposed to client JS.
 *
 * Everything here is per-visitor (cart contents, checkout), so it must
 * never be cached anywhere: the route is forced dynamic, the upstream fetch
 * is no-store, and every response says `private, no-store`.
 */
export const dynamic = "force-dynamic";

const NO_STORE = "private, no-store, max-age=0";
const CART_TOKEN_COOKIE = "onyx_cart_token";
const NONCE_COOKIE = "onyx_cart_nonce";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 14, // 2 weeks, matches a typical Woo cart session
};

async function proxy(request: NextRequest, method: string, path: string[]) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value;
  const nonce = cookieStore.get(NONCE_COOKIE)?.value;

  const targetUrl = `${wcStoreApiUrl()}/${path.join("/")}${request.nextUrl.search}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cartToken) headers["Cart-Token"] = cartToken;
  if (nonce) headers["Nonce"] = nonce;

  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await request.text() : undefined;

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      method,
      headers,
      body: body || undefined,
      cache: "no-store",
    });
  } catch {
    // Same `{ code, message }` shape as Store API errors, so the client's
    // error-code mapping handles it (and shows its own translated text).
    return NextResponse.json(
      { code: "onyx_store_unavailable", message: "Store backend unreachable" },
      { status: 502, headers: { "Cache-Control": NO_STORE } },
    );
  }

  const responseText = await upstream.text();
  const response = new NextResponse(responseText, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": NO_STORE,
    },
  });

  const newCartToken = upstream.headers.get("Cart-Token");
  if (newCartToken && newCartToken !== cartToken) {
    response.cookies.set(CART_TOKEN_COOKIE, newCartToken, COOKIE_OPTIONS);
  }

  const newNonce = upstream.headers.get("Nonce");
  if (newNonce && newNonce !== nonce) {
    response.cookies.set(NONCE_COOKIE, newNonce, COOKIE_OPTIONS);
  }

  return response;
}

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

async function handler(request: NextRequest, { params }: RouteParams) {
  const { path } = await params;
  return proxy(request, request.method, path);
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
