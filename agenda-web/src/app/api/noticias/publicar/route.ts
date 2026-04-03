import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const API_SECRET = process.env.API_SECRET || "guiasports-secret-2024";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${API_SECRET}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { titulo, contenido, imagen_url, fecha } = await request.json();

    if (!titulo || !contenido) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      .insert([{ titulo, contenido, imagen_url, fecha, slug }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, noticia: data[0] });

  } catch (error: any) {
    console.error("Error publicando noticia:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
