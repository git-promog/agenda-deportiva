import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from '@/lib/adminSession';
import { getRequiredServerEnv } from '@/lib/serverConfig';

/** Comparación en tiempo constante para evitar timing attacks. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) {
    // Mantiene el tiempo de respuesta aproximadamente constante
    crypto.timingSafeEqual(ba, ba);
    return false;
  }
  return crypto.timingSafeEqual(ba, bb);
}

export async function POST(request: Request) {
  try {
    // Fail closed: sin contraseña configurada no existe valor por defecto
    const adminPassword = getRequiredServerEnv('ADMIN_PASSWORD');
    if (!process.env.ADMIN_SESSION_SECRET) {
      console.error('ADMIN_SESSION_SECRET no está configurada en el servidor');
      return NextResponse.json(
        { error: 'Autenticación no disponible' },
        { status: 500 }
      );
    }

    const { password } = await request.json();

    if (typeof password !== 'string' || !safeEqual(password, adminPassword)) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    const { token, maxAge } = createAdminSessionToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login admin:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
