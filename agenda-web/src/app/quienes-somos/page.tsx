import Link from 'next/link';
import { Trophy, ArrowLeft, Users, ShieldCheck, Zap, Newspaper, Target, CheckCircle2 } from 'lucide-react';
import NextImage from 'next/image';
import { Metadata } from 'next';
import { EDITORIAL_TEAM } from '@/data/teamData';

export const metadata: Metadata = {
  title: "Quiénes Somos | GuíaSports - Nuestra Autoridad Editorial",
  description: "Conoce al equipo detrás de GuíaSports, nuestra metodología de verificación de datos y el compromiso con los aficionados al deporte en México.",
  alternates: {
    canonical: "https://www.guiasports.com/quienes-somos",
  },
};

export default function QuienesSomos() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-[#020617]"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/images/grid.svg')] bg-center"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-12 hover:text-blue-400 transition-all hover:-translate-x-1">
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
          
          <div className="mb-8 flex justify-center">
             <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={240} height={60} priority className="h-12 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Autoridad <span className="text-blue-500">Editorial</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">GuíaSports México</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        {/* Misión Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={120} className="text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/40">
              <Users className="text-white" size={24} />
            </div>
            <h2 className="text-blue-500 font-black italic uppercase mb-6 tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-blue-500/30"></span> Nuestra Misión
            </h2>
            <p className="text-2xl md:text-3xl font-black italic text-white leading-tight mb-8">
              &quot;Ayudar a los aficionados mexicanos a encontrar su pasión, sin importar en qué plataforma se transmita.&quot;
            </p>
            <p className="text-slate-400 leading-relaxed text-lg">
              GuíaSports no es solo una agenda; es una respuesta a la fragmentación de derechos en México. Nacimos de la frustración de buscar en múltiples aplicaciones para encontrar un solo partido. Hoy, somos la herramienta definitiva para más de 10 disciplinas deportivas.
            </p>
          </div>
        </div>

        {/* Metodología */}
        <section className="mb-24">
          <div className="text-center mb-12">
             <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Cómo trabajamos</h2>
             <h3 className="text-3xl font-black italic uppercase text-white">Metodología <span className="text-blue-500">Precisión</span></h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="text-yellow-400" />, title: "Agregación Directa", desc: "Conexión con señales oficiales y proveedores de broadcasting." },
              { icon: <ShieldCheck className="text-blue-400" />, title: "Verificación Humana", desc: "Nuestro equipo valida cambios de horario de última hora manualmente." },
              { icon: <CheckCircle2 className="text-[#a3e635]" />, title: "Actualización ISR", desc: "Tecnología de regeneración estática para servir datos en milisegundos." }
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[32px] hover:border-blue-500/30 transition-colors">
                <div className="mb-6">{item.icon}</div>
                <h4 className="text-sm font-black uppercase italic text-white mb-3">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-wider opacity-60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo Editorial */}
        <section className="mb-24">
          <div className="text-center mb-12">
             <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Especialistas al frente</h2>
             <h3 className="text-3xl font-black italic uppercase text-white">Equipo <span className="text-blue-500">Editorial</span></h3>
          </div>

          <div className="grid gap-6">
            {EDITORIAL_TEAM.map((member) => (
              <div key={member.id} className="bg-slate-900/30 border border-slate-800/50 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start group hover:bg-slate-900/50 transition-colors">
                <Link href={`/autores/${member.id}`} className="w-24 h-24 md:w-32 md:h-32 bg-slate-800 rounded-[24px] overflow-hidden shrink-0 border border-white/5 relative block hover:opacity-80 transition-opacity">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                  {member.avatar ? (
                    <NextImage src={member.avatar} alt={member.name} fill className="object-cover" sizes="128px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-700">{member.name.charAt(0)}</div>
                  )}
                </Link>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <Link href={`/autores/${member.id}`}>
                      <h4 className="text-xl font-black uppercase italic text-white hover:text-blue-500 transition-colors">{member.name}</h4>
                    </Link>
                    <span className="bg-blue-600/10 text-blue-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-blue-500/20">Verificado</span>
                  </div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">{member.role} • Especialista en {member.specialty}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Audit CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-[40px] p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 opacity-20 blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-white font-black uppercase italic text-2xl mb-2 relative z-10">¿Eres periodista deportivo?</h2>
          <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-8 relative z-10">Únete a nuestra red de especialistas en GuíaSports</p>
          <Link href="/contacto" className="inline-block bg-white text-blue-900 px-10 py-5 rounded-2xl font-black uppercase text-xs italic hover:scale-105 transition-all shadow-xl relative z-10">
            Contactar al Equipo
          </Link>
        </div>
      </div>
    </div>
  );
}
