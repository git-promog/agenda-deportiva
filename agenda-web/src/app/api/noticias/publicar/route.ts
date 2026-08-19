import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/adminSession";
import { getRequiredServerEnv } from "@/lib/serverConfig";

export async function POST(request: Request) {
  try {
    if (!isAuthorizedAdminRequest(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { titulo, contenido, imagen_url, fecha, autor } = await request.json();

    if (!titulo || !contenido) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const supabase = createClient(
      getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_URL"),
      getRequiredServerEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    const slugBase = titulo
      .toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const slug = slugBase + "-" + Math.floor(Math.random() * 1000);

    const { data, error } = await supabase
      .from('noticias')
      .insert([{ titulo, contenido, imagen_url, fecha, slug, autor }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, noticia: data[0] });

  } catch (error: unknown) {
    console.error("Error publicando noticia:", error);
    return NextResponse.json({ error: "Error al publicar noticia" }, { status: 500 });
  }
}
