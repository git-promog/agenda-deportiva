import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function Contacto() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        <Link href="/" className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest mb-10 hover:text-blue-400">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[40px] text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl shadow-blue-900/40">
            <Mail className="text-white" size={32} />
          </div>
          
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
            Ponte en <span className="text-blue-500">Contacto</span>
          </h1>
          <p className="text-slate-400 mb-10 leading-relaxed">
            ¿Tienes sugerencias, reportes de canales o propuestas de publicidad? Nos encantaría escucharte.
          </p>

          <a 
            href="mailto:tu-correo@ejemplo.com" 
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-8 rounded-2xl transition-all uppercase tracking-widest text-sm italic shadow-lg shadow-blue-900/40"
          >
            <Send size={18} /> Enviar un Correo
          </a>

          <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-widest">
            Respondemos en menos de 24 horas hábiles.
          </p>
        </div>
      </div>
    </div>
  );
}