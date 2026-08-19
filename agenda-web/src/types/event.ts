export type Evento = {
  id: string;
  fecha: string;
  hora: string;
  evento: string;
  competicion: string;
  deporte: string;
  canales: string;
  destacado?: boolean | null;
  // Campos adicionales opcionales presentes en Supabase
  liga?: string | null;
  equipo_local?: string | null;
  equipo_visitante?: string | null;
  tv_abierta?: boolean | null;
  link_transmision?: string | null;
  created_at?: string | null;
};
