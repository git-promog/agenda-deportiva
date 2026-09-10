import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="gs-footer max-w-4xl mx-auto w-full">
      <div className="gs-footer-links flex flex-wrap justify-center">
        <Link href="/" className="gs-footer-link">Inicio</Link>
        <Link href="/noticias" className="gs-footer-link">Noticias</Link>
        <Link href="/quienes-somos" className="gs-footer-link">Quiénes Somos</Link>
        <Link href="/privacidad" prefetch={false} className="gs-footer-link">Privacidad</Link>
        <Link href="/contacto" prefetch={false} className="gs-footer-link">Contacto</Link>
      </div>
      <p className="gs-footer-copy">
        © {new Date().getFullYear()} GuíaSports <br/>
        Toda la programación está sujeta a cambios por parte de las televisoras. <br/>
        No transmitimos eventos, solo proporcionamos información de guía de canales.
      </p>
    </footer>
  );
}
