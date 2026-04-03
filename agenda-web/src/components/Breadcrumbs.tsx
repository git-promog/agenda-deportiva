import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  current: string;
}

export default function Breadcrumbs({ items, current }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@id": `https://www.guiasports.com${item.href}`,
          "name": item.label
        }
      })),
      {
        "@type": "ListItem",
        "position": items.length + 1,
        "item": {
          "@id": `https://www.guiasports.com${items.length > 0 ? items[items.length - 1].href : '/'}`,
          "name": current
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8">
        <Link href="/" className="text-slate-600 hover:text-blue-400 transition-colors">Inicio</Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-slate-700">/</span>
            <Link href={item.href} className="text-slate-500 hover:text-blue-400 transition-colors">{item.label}</Link>
          </span>
        ))}
        <span className="text-slate-700">/</span>
        <span className="text-slate-300">{current}</span>
      </nav>
    </>
  );
}
