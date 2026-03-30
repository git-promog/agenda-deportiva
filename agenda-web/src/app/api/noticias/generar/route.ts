import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
      9. Para la imagen, NO busques en internet. Solo devuelve: "generada" en el campo imagen_url - nosotros pondremos la imagen automáticamente según el deporte.

      Estructura de salida (JSON estricto):
      {
        "titulo": "Un titular llamativo de máximo 60 caracteres enfocado en SEO",
        "contenido": "El cuerpo completo del artículo respetando las reglas de formato",
        "slug": "un-slug-url-amigable-basado-en-el-titulo",
        "imagen_url": "generada"
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Limpiar respuesta por si Gemini agrega bloques de código markdown
    responseText = responseText.replace(/```json|```/g, "").trim();
    
    // Eliminar caracteres de control inválidos en JSON
    responseText = responseText.replace(/[\x00-\x1F\x7F]/g, '');
    
    // Buscar el objeto JSON en la respuesta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No se pudo parsear la respuesta de la IA");
    }
    
    const dataIA = JSON.parse(jsonMatch[0]);

    // Imágenes por defecto según el deporte
    const imagenesPorDeporte: { [key: string]: string } = {
      "Fútbol": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
      "Básquetbol": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
      "Béisbol": "https://images.unsplash.com/photo-1536128560176-d6652a30310d?w=800&q=80",
      "Fórmula 1": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "Motorismo": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
      "Tenis": "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
      "Fútbol Americano": "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
      "Rugby": "https://images.unsplash.com/photo-1533130061792-649d45e41234?w=800&q=80",
      "Hockey": "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80",
      "Combate": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
      "Ciclismo": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      "Voleibol": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
      "Golf": "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
      "Natación": "https://images.unsplash.com/photo-1519315901367-f34f9150fa56?w=800&q=80",
      "Otros": "https://images.unsplash.com/photo-1461896836934- voices-victory?w=800&q=80"
    };

    const deporte = metadatos?.deporte || "Fútbol";
    const imagenUrl = imagenesPorDeporte[deporte] || imagenesPorDeporte["Fútbol"];

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('noticias')
      .insert([
        {
          titulo: dataIA.titulo,
          contenido: dataIA.contenido,
          slug: dataIA.slug + "-" + Math.floor(Math.random() * 1000),
          imagen_url: imagenUrl,
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
