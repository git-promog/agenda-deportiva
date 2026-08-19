import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  verifyAdminSessionToken,
  isAdminRequest,
  isAuthorizedAdminRequest,
} from '@/lib/adminSession';

const SECRET = 'a'.repeat(64);
const API_SECRET = 'api-secret-test';

describe('adminSession', () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    process.env.ADMIN_API_SECRET = API_SECRET;
  });

  afterEach(() => {
    delete process.env.ADMIN_SESSION_SECRET;
    delete process.env.ADMIN_API_SECRET;
  });

  it('crea un token firmado en formato expiracion.firma', () => {
    const { token, maxAge } = createAdminSessionToken();
    const [expiry, signature] = token.split('.');
    expect(Number(expiry)).toBeGreaterThan(Date.now());
    expect(signature).toMatch(/^[a-f0-9]{64}$/);
    expect(maxAge).toBe(24 * 60 * 60);
  });

  it('verifica un token valido', () => {
    const { token } = createAdminSessionToken();
    expect(verifyAdminSessionToken(token)).toBe(true);
  });

  it('rechaza un token con firma alterada', () => {
    const { token } = createAdminSessionToken();
    const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
    expect(verifyAdminSessionToken(tampered)).toBe(false);
  });

  it('rechaza un token expirado', () => {
    const expired = `1.${'0'.repeat(64)}`;
    expect(verifyAdminSessionToken(expired)).toBe(false);
  });

  it('rechaza tokens malformados', () => {
    expect(verifyAdminSessionToken(undefined)).toBe(false);
    expect(verifyAdminSessionToken(null)).toBe(false);
    expect(verifyAdminSessionToken('sin-punto')).toBe(false);
    expect(verifyAdminSessionToken('abc.xyz')).toBe(false);
  });

  it('rechaza tokens con expiracion no numerica o firma no hexadecimal', () => {
    const nonNumeric = `abc.${'0'.repeat(64)}`;
    const badSignature = `1234567890.${'z'.repeat(64)}`;
    expect(verifyAdminSessionToken(nonNumeric)).toBe(false);
    expect(verifyAdminSessionToken(badSignature)).toBe(false);
  });

  it('isAdminRequest acepta la cookie valida y rechaza ausencia o token invalido', () => {
    const { token } = createAdminSessionToken();
    const valid = new Request('http://localhost/api/admin/session', {
      headers: { cookie: `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}` },
    });
    expect(isAdminRequest(valid)).toBe(true);

    const noCookie = new Request('http://localhost/api/admin/session');
    expect(isAdminRequest(noCookie)).toBe(false);

    const badCookie = new Request('http://localhost/api/admin/session', {
      headers: { cookie: `${ADMIN_SESSION_COOKIE}=forjado` },
    });
    expect(isAdminRequest(badCookie)).toBe(false);
  });

  it('isAuthorizedAdminRequest acepta Bearer con ADMIN_API_SECRET y rechaza otros', () => {
    const valid = new Request('http://localhost/api/admin', {
      headers: { authorization: `Bearer ${API_SECRET}` },
    });
    expect(isAuthorizedAdminRequest(valid)).toBe(true);

    const wrong = new Request('http://localhost/api/admin', {
      headers: { authorization: 'Bearer incorrecto' },
    });
    expect(isAuthorizedAdminRequest(wrong)).toBe(false);

    const missing = new Request('http://localhost/api/admin');
    expect(isAuthorizedAdminRequest(missing)).toBe(false);
  });
});