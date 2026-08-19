import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST as loginPOST } from '@/app/api/admin/login/route';
import { GET as sessionGET } from '@/app/api/admin/session/route';
import { POST as logoutPOST } from '@/app/api/admin/logout/route';
import { createAdminSessionToken } from '@/lib/adminSession';

const PASSWORD = 'password-seguro-test';
const SECRET = 'b'.repeat(64);

async function loginBody(password: string): Promise<Request> {
  return new Request('http://localhost/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  });
}

describe('API /api/admin/login', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = PASSWORD;
    process.env.ADMIN_SESSION_SECRET = SECRET;
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it('fail-closed: sin ADMIN_SESSION_SECRET devuelve 500 Autenticacion no disponible', async () => {
    delete process.env.ADMIN_SESSION_SECRET;
    const res = await loginPOST(await loginBody(PASSWORD));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Autenticación no disponible' });
  });

  it('fail-closed: sin ADMIN_PASSWORD devuelve 500 Error interno', async () => {
    delete process.env.ADMIN_PASSWORD;
    const res = await loginPOST(await loginBody(PASSWORD));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Error interno' });
  });

  it('contraseña incorrecta devuelve 401', async () => {
    const res = await loginPOST(await loginBody('incorrecta'));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Contraseña incorrecta' });
  });

  it('contraseña correcta devuelve 200 con cookie de sesión', async () => {
    const res = await loginPOST(await loginBody(PASSWORD));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeTruthy();
    if (!setCookie) throw new Error('set-cookie ausente');
    expect(setCookie).toContain('admin_session=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('SameSite=');
    expect(setCookie.toLowerCase()).toContain('samesite=strict');
  });

  it('password no string devuelve 401 sin lanzar', async () => {
    const res = await loginPOST(
      new Request('http://localhost/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: 12345 }),
      }),
    );
    expect(res.status).toBe(401);
  });
});

describe('API /api/admin/session', () => {
  it('devuelve authenticated false sin cookie', async () => {
    const res = await sessionGET(new Request('http://localhost/api/admin/session'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ authenticated: false });
  });

  it('devuelve authenticated true con cookie válida', async () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    const { token } = createAdminSessionToken();
    const res = await sessionGET(
      new Request('http://localhost/api/admin/session', {
        headers: { cookie: `admin_session=${encodeURIComponent(token)}` },
      }),
    );
    expect(await res.json()).toEqual({ authenticated: true });
    delete process.env.ADMIN_SESSION_SECRET;
  });
});

describe('API /api/admin/logout', () => {
  it('devuelve success y borra la cookie', async () => {
    const res = await logoutPOST();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('admin_session=');
    expect(setCookie).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/i);
  });
});