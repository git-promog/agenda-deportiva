import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const API_SECRET = process.env.API_SECRET || "guiasports-secret-2024";

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const record = requestCounts.get(ip);
  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${API_SECRET}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
    }

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

    // Imágenes por defecto según el deporte (múltiples opciones para variedad)
    const imagenesPorDeporte: { [key: string]: string[] } = {
      "Fútbol": [
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
        "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
        "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
      ],
      "Básquetbol": [
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
        "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&q=80",
        "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&q=80",
        "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80",
      ],
      "Béisbol": [
        "https://images.unsplash.com/photo-1536128560176-d6652a30310d?w=800&q=80",
        "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800&q=80",
        "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
      ],
      "Fórmula 1": [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
        "https://images.unsplash.com/photo-1610874457278-825f0b447714?w=800&q=80",
      ],
      "Motorismo": [
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
        "https://images.unsplash.com/photo-1609630876574-05d5b6962a7a?w=800&q=80",
      ],
      "Tenis": [
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80",
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d4?w=800&q=80",
      ],
      "Fútbol Americano": [
        "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
        "https://images.unsplash.com/photo-1580692475446-c2e4f75c355b?w=800&q=80",
      ],
      "Rugby": [
        "https://images.unsplash.com/photo-1533130061792-649d45e41234?w=800&q=80",
        "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80",
      ],
      "Hockey": [
        "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800&q=80",
        "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&q=80",
      ],
      "Combate": [
        "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&q=80",
      ],
      "Ciclismo": [
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
        "https://images.unsplash.com/photo-1541625602330-ef2876a4201f?w=800&q=80",
      ],
      "Voleibol": [
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
      ],
      "Golf": [
        "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
        "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80",
      ],
      "Natación": [
        "https://images.unsplash.com/photo-1519315901367-f34f9150fa56?w=800&q=80",
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
      ],
      "Otros": [
        "https://images.unsplash.com/photo-1461896836934-6e0f4e2f4e2f?w=800&q=80",
        "https://images.unsplash.com/photo-1526232761682-d26e0ccac188?w=800&q=80",
      ],
    };

    const deporte = metadatos?.deporte || "Fútbol";
    const opcionesImagen = imagenesPorDeporte[deporte] || imagenesPorDeporte["Fútbol"];
    const imagenUrl = opcionesImagen[Math.floor(Math.random() * opcionesImagen.length)];

    return NextResponse.json({ 
      success: true, 
      preview: {
        titulo: dataIA.titulo,
        contenido: dataIA.contenido,
        slug: dataIA.slug,
        imagen_url: imagenUrl,
        fecha: new Date().toISOString().split('T')[0]
      }
    });

  } catch (error: any) {
    console.error("Error IA Gen:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
