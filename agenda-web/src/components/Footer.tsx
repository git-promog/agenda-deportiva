import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-900 mt-10 text-center w-full">
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <Link href="/" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors">Inicio</Link>
        <Link href="/quienes_somos" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors">Quiénes Somos</Link>
        <Link href="/privacidad" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors">Privacidad</Link>
        <Link href="/contacto" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors">Contacto</Link>
      </div>
      <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] leading-loose">
        © {new Date().getFullYear()} Agenda Deportiva MX <br/>
        Toda la programación está sujeta a cambios por parte de las televisoras. <br/>
        No transmitimos eventos, solo proporcionamos información de guía de canales.
      </p>
    </footer>
  );
}