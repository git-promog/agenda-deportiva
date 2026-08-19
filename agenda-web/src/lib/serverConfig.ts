/**
 * Lee una variable de entorno obligatoria sin proporcionar valores de respaldo.
 * Las rutas de servidor deben fallar de forma explícita si la configuración
 * sensible no está disponible.
 */
export function getRequiredServerEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} no está configurada en el servidor`);
  }
  return value;
}
