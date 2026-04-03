"use client";

import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import NextImage from 'next/image';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = "service_8jpuz7y";
const EMAILJS_TEMPLATE_ID = "template_vmldmig";
const EMAILJS_PUBLIC_KEY = "m9M0pPYx5-TSARGfh";

export default function ContactoForm() {
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    phone: "",
    message: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<'idle' | 'exito' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setEstado('idle');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.from_name,
          from_email: formData.from_email,
          phone: formData.phone || "No proporcionado",
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setEstado('exito');
      setFormData({ from_name: "", from_email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error enviando email:", error);
      setEstado('error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        <Link href="/" className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest mb-10 hover:text-blue-400">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className="bg-slate-900/50 border border-slate-800 p-8 md:p-10 rounded-[40px]">
          <div className="flex justify-center mb-8 w-full">
            <NextImage src="/GuiaSports-logo.svg" alt="GuíaSports" width={220} height={55} className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </div>

          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl shadow-blue-900/40">
            <Mail className="text-white" size={32} />
          </div>
          
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-center">
            Ponte en <span className="text-blue-500">Contacto</span>
          </h1>
          <p className="text-slate-400 mb-10 leading-relaxed text-center">
            ¿Tienes sugerencias, reportes de canales o propuestas de publicidad? Nos encantaría escucharte.
          </p>

          {estado === 'exito' ? (
            <div className="text-center py-10">
              <div className="bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-2xl p-8">
                <CheckCircle className="text-[#a3e635] mx-auto mb-4" size={48} />
                <h3 className="text-xl font-black italic uppercase text-white mb-2">¡Mensaje Enviado!</h3>
                <p className="text-slate-400 text-sm mb-6">Gracias por contactarnos. Te responderemos en menos de 24 horas hábiles.</p>
                <button 
                  onClick={() => setEstado('idle')}
                  className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Nombre *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Tu nombre completo"
                  className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none text-white focus:border-blue-500 transition-colors shadow-inner"
                  value={formData.from_name}
                  onChange={(e) => setFormData({...formData, from_name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Correo Electrónico *</label>
                <input 
                  type="email" 
                  required
                  placeholder="tu@correo.com"
                  className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none text-white focus:border-blue-500 transition-colors shadow-inner"
                  value={formData.from_email}
                  onChange={(e) => setFormData({...formData, from_email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Teléfono <span className="text-slate-600">(opcional)</span></label>
                <input 
                  type="tel" 
                  placeholder="+52 55 1234 5678"
                  className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none text-white focus:border-blue-500 transition-colors shadow-inner"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Comentarios *</label>
                <textarea 
                  rows={5}
                  required
                  placeholder="Escribe tu mensaje, sugerencia o propuesta..."
                  className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none text-white focus:border-blue-500 transition-colors shadow-inner resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              {estado === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-600/10 border border-red-500/20 p-4 rounded-xl">
                  <AlertCircle size={16} />
                  Hubo un error al enviar el mensaje. Intenta de nuevo.
                </div>
              )}

              <button 
                type="submit"
                disabled={enviando}
                className={`w-full flex items-center justify-center gap-3 ${enviando ? 'bg-blue-900 cursor-not-allowed opacity-60' : 'bg-blue-600 hover:bg-blue-500'} text-white font-black py-5 px-8 rounded-2xl transition-all uppercase tracking-widest text-sm italic shadow-lg shadow-blue-900/40`}
              >
                {enviando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Enviar Mensaje
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[10px] text-slate-600 uppercase tracking-widest">
                Respondemos en menos de 24 horas hábiles.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
