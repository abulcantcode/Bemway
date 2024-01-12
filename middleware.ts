import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const routesToIgnore = ["/", "/auth"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = new URL(request.url).pathname;

  try {
    const response = await fetch(`${process.env.BACKEND_ROUTE}session`, {
      credentials: "include",
      headers: { Cookie: request.cookies.toString() },
    });

    if (response.ok) {
      if (!routesToIgnore.every((ignorePath) => ignorePath !== path)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      if (routesToIgnore.every((ignorePath) => ignorePath !== path)) {
        console.log(
          "backend server error",
          response?.statusText,
          response?.status
        );
        if (response.status === 401) {
          console.log("Due to user not being Authorised");

          const returnResponse = NextResponse.redirect(
            new URL("/auth", request.url)
          );
          returnResponse.cookies.set("connect.sid", "", {
            expires: new Date(Date.now()),
          });
          return returnResponse;
        }
      }
    }
  } catch {}

  return;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
