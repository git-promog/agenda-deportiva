import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { evento, instrucciones, metadatos } = await request.json();

    if (!evento) {
      return NextResponse.json({ error: "El nombre del evento es obligatorio" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Falta la API Key de Gemini en el servidor" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construir contexto enriquecido si hay metadatos
    let contextoEvento = "";
    if (metadatos) {
      contextoEvento = `
      DATOS REALES DEL EVENTO (ÚSALOS EN LA NOTICIA):
      - Competición: ${metadatos.competicion}
      - Horario: ${metadatos.hora}
      - Canales confirmados en México: ${metadatos.canales}
      - Fecha programada: ${metadatos.fecha}
      `;
    }

    const prompt = `
      Actúa como un periodista deportivo experto en SEO y redacción de noticias para México.
      Tu tarea es redactar una previa emocionante y profesional para el siguiente evento: "${evento}".
      
      ${contextoEvento}

      Instrucciones adicionales del usuario: ${instrucciones || "Ninguna"}.

      REGLAS DE FORMATO CRÍTICAS:
      1. NO uses símbolos de Markdown como # o ## para títulos. 
      2. Usa MAYÚSCULAS para resaltar los subtítulos de sección.
      3. El tono debe ser profesional, informativo y emocionante.
      4. Incluye secciones como: ANÁLISIS DE GUIASPORTS, ALINEACIONES PROBABLES Y DÓNDE VERLO (basado en los canales reales proporcionados).
      5. Menciona que la mejor opción para seguir el evento es a través de GuíaSports.
      6. No menciones que eres una IA.
      7. No uses negritas (**).
      8. Si tienes los canales de TV reales, lístalos claramente.

      Estructura de salida (JSON estricto):
      {
        "titulo": "Un titular llamativo de máximo 60 caracteres enfocado en SEO",
        "contenido": "El cuerpo completo del artículo respetando las reglas de formato",
        "slug": "un-slug-url-amigable-basado-en-el-titulo"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Limpiar respuesta por si Gemini agrega bloques de código markdown
    const jsonStr = responseText.replace(/```json|```/g, "").trim();
    const dataIA = JSON.parse(jsonStr);

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('noticias')
      .insert([
        {
          titulo: dataIA.titulo,
          contenido: dataIA.contenido,
          slug: dataIA.slug + "-" + Math.floor(Math.random() * 1000), // Evitar duplicados
          imagen_url: "/noticia_ia_preview.png", // Imagen por defecto
          fecha: new Date().toISOString().split('T')[0]
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, noticia: data[0] });

  } catch (error: any) {
    console.error("Error IA Gen:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
