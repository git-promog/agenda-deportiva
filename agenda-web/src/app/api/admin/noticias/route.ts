import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminSession";
import { getRequiredServerEnv } from "@/lib/serverConfig";

/**
 * Eliminación de noticias en el servidor con SERVICE_ROLE_KEY.
 * (Crear/editar ya existen en /api/noticias/publicar y /api/noticias/editar)
 */
export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Falta el id de la noticia" }, { status: 400 });
    }
    const supabase = createClient(
      getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_URL"),
      getRequiredServerEnv("SUPABASE_SERVICE_ROLE_KEY")
    );
    const { error } = await supabase.from("noticias").delete().eq("id", String(id));
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando noticia:", error);
    return NextResponse.json({ error: "Error al eliminar noticia" }, { status: 500 });
  }
}
