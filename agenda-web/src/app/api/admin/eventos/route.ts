import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminSession";
import { getRequiredServerEnv } from "@/lib/serverConfig";

/**
 * Escrituras de la tabla `eventos` ejecutadas en el servidor con la
 * SERVICE_ROLE_KEY (bypasa RLS). La clave anónima del cliente solo lee.
 */

// Campos permitidos: evita mass-assignment de columnas arbitrarias
const ALLOWED_FIELDS = [
  "evento",
  "hora",
  "canales",
  "competicion",
  "deporte",
  "fecha",
  "destacado",
  "ajuste_manual",
  "destacado_dia",
  "estelar_dia",
  "destacado_finde",
  "carrusel_ig",
] as const;

function sanitize(payload: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in payload) data[key] = payload[key];
  }
  return data;
}

function getSupabaseAdmin() {
  return createClient(
    getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredServerEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

// Crear evento
export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const body = await request.json();
    const data = sanitize(body ?? {});
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const { error } = await getSupabaseAdmin().from("eventos").insert([data]);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creando evento:", error);
    return NextResponse.json({ error: "Error al crear evento" }, { status: 500 });
  }
}

// Actualizar evento: { id, data } o masivo { ids: [], data }
export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const body = await request.json();
    const data = sanitize(body?.data ?? {});
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    let error;

    if (Array.isArray(body?.ids) && body.ids.length > 0) {
      ({ error } = await supabase
        .from("eventos")
        .update(data)
        .in("id", body.ids.map(String)));
    } else if (body?.id) {
      ({ error } = await supabase
        .from("eventos")
        .update(data)
        .eq("id", String(body.id)));
    } else {
      return NextResponse.json({ error: "Falta el id del evento" }, { status: 400 });
    }

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando evento:", error);
    return NextResponse.json({ error: "Error al actualizar evento" }, { status: 500 });
  }
}

// Eliminar evento: { id }
export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Falta el id del evento" }, { status: 400 });
    }
    const { error } = await getSupabaseAdmin()
      .from("eventos")
      .delete()
      .eq("id", String(id));
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando evento:", error);
    return NextResponse.json({ error: "Error al eliminar evento" }, { status: 500 });
  }
}
