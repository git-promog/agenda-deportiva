import crypto from "node:crypto";
import { getRequiredServerEnv } from "@/lib/serverConfig";

/**
 * Sesión administrativa basada en un token HMAC firmado en el servidor.
 *
 * Formato del token: `<expiryMs>.<hmac_sha256_hex>`
 * El valor nunca es predecible ni falsificable sin el secreto del servidor,
 * a diferencia del antiguo valor fijo `admin_session=authenticated`.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas

function getSecret(): string {
  return getRequiredServerEnv("ADMIN_SESSION_SECRET");
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createAdminSessionToken(): { token: string; maxAge: number } {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const signature = sign(`admin.${expiry}`);
  return { token: `${expiry}.${signature}`, maxAge: SESSION_DURATION_MS / 1000 };
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const expiry = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  if (!/^\d+$/.test(expiry) || !/^[a-f0-9]{64}$/.test(signature)) return false;
  if (Number(expiry) < Date.now()) return false;

  let expected: string;
  try {
    expected = sign(`admin.${expiry}`);
  } catch {
    return false;
  }

  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Extrae y verifica la cookie de sesión desde una Request (Route Handlers). */
export function isAdminRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${ADMIN_SESSION_COOKIE}=([^;]+)`)
  );
  if (!match) return false;

  try {
    return verifyAdminSessionToken(decodeURIComponent(match[1]));
  } catch {
    return false;
  }
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

/**
 * Autoriza sesiones de navegador o automatizaciones server-to-server.
 * El único secreto Bearer aceptado es ADMIN_API_SECRET.
 */
export function isAuthorizedAdminRequest(request: Request): boolean {
  if (isAdminRequest(request)) return true;

  const authorization = request.headers.get("authorization");
  const apiSecret = process.env.ADMIN_API_SECRET;
  if (!authorization || !apiSecret || !authorization.startsWith("Bearer ")) {
    return false;
  }

  return safeEqual(authorization.slice("Bearer ".length), apiSecret);
}
