import { createClient } from '@supabase/supabase-js'
import { Tv, Calendar, Trophy, Clock } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Función para formatear la fecha a "Martes, 24 de Marzo"
function formatearFecha(fechaStr: string) {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toLocaleDateString('es-MX', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
}

export default async function Home() {
  // 1. Traer los datos ordenados por FECHA y luego por HORA
  const { data: eventos, error } = await supabase
    .from('eventos')
    .select('*')
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true })

  if (error) return <div className="text-white p-10 text-center">Error al conectar con la base de datos...</div>

  // 2. Lógica para agrupar eventos por fecha
  const eventosAgrupados = eventos?.reduce((groups: any, evento) => {
    const fecha = evento.fecha;
    if (!groups[fecha]) {
      groups[fecha] = [];
    }
    groups[fecha].push(evento);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* Header Fijo */}
      <header className="border-b border-slate-800 bg-[#020617]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Agenda <span className="text-blue-500">Deportiva</span>
            </h1>
          </div>
          <div className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-widest">
            México
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {eventosAgrupados && Object.keys(eventosAgrupados).length > 0 ? (
          // Recorremos cada grupo de fecha
          Object.keys(eventosAgrupados).sort().map((fecha) => (
            <section key={fecha} className="mb-12">
              {/* Encabezado de Fecha */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-slate-800"></div>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {formatearFecha(fecha)}
                </h2>
                <div className="h-px flex-1 bg-slate-800"></div>
              </div>

              {/* Lista de partidos de ese día */}
              <div className="grid gap-3">
                {eventosAgrupados[fecha].map((evento: any) => (
                  <div 
                    key={evento.id} 
                    className="group bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 hover:border-blue-500/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Hora e Info */}
                      <div className="flex items-center gap-4 min-w-[100px]">
                        <div className="flex items-center gap-1.5 text-blue-400 font-mono font-bold text-lg">
                          <Clock className="w-3.5 h-3.5 opacity-50" />
                          {evento.hora}
                        </div>
                      </div>

                      {/* Evento Principal */}
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                          {evento.competicion}
                        </div>
                        <h3 className="text-md font-bold text-slate-200 group-hover:text-white transition-colors">
                          {evento.evento}
                        </h3>
                      </div>

                      {/* Canales de TV */}
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 group-hover:border-blue-900/50 transition-all">
                        <Tv className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-bold text-emerald-400 italic">
                          {evento.canales}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500">No hay eventos próximos.</p>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-10 border-t border-slate-900 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
          Programación sujeta a cambios por las televisoras
        </p>
      </footer>
    </div>
  )
}