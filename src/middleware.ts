import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = [
  "http://localhost:5173",
  "https://traindiary.vercel.app",
  "http://127.0.0.1:5173",
  "http://0.0.0.0:5173",
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || "";

  // Normalize paths that have duplicate leading slashes (e.g. //api/...)
  // Rewriting avoids sending a redirect which breaks CORS preflight OPTIONS.
  try {
    const reqUrl = new URL(request.url);
    if (/^\/\//.test(reqUrl.pathname)) {
      reqUrl.pathname = reqUrl.pathname.replace(/^\/+/, "/");
      return NextResponse.rewrite(reqUrl);
    }
  } catch {
    // If URL parsing fails for any reason, continue normally.
  }
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Credentials",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  const response = NextResponse.next();

  // Add the CORS headers to all responses
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export const config = {
  matcher: [
    // Run middleware for all paths so we can normalize malformed paths
    // (e.g. paths with duplicate leading slashes like `//api/...`) before
    // the platform performs a redirect which breaks CORS preflight requests.
    "/*",
  ],
};
