export type Noticia = {
  id: string;
  titulo: string;
  slug: string;
  contenido?: string | null;
  resumen?: string | null;
  imagen_url?: string | null;
  fecha?: string | null;
  fecha_publicacion?: string | null;
  autor?: string | null;
  categoria?: string | null;
  created_at?: string | null;
};
