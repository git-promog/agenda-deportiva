import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/adminSession";

/**
 * Proxy (antes "middleware" en Next.js <= 15).
 * Protege la ruta /admin en el servidor: sin cookie de sesión firmada
 * válida, el panel ni siquiera se renderiza y se redirige al login.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = verifyAdminSessionToken(token);
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isLoginPage) {
    // Ya autenticado: no tiene sentido ver el login
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
