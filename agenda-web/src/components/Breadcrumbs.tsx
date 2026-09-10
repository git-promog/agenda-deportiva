import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  current: string;
  currentHref: string;
}

export default function Breadcrumbs({ items, current, currentHref }: BreadcrumbsProps) {
  const normalizeHref = (href: string) => href.startsWith('/') ? href : `/${href}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": "https://www.guiasports.com",
          "name": "Inicio"
        }
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "item": {
          "@id": `https://www.guiasports.com${normalizeHref(item.href)}`,
          "name": item.label
        }
      })),
      {
        "@type": "ListItem",
        "position": items.length + 2,
        "item": {
          "@id": `https://www.guiasports.com${normalizeHref(currentHref)}`,
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
      <nav aria-label="Breadcrumb" className="gs-breadcrumbs">
        <Link href="/" className="gs-breadcrumbs-link">Inicio</Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="gs-breadcrumbs-separator" aria-hidden="true">/</span>
            <Link href={item.href} className="gs-breadcrumbs-link">{item.label}</Link>
          </span>
        ))}
        <span className="gs-breadcrumbs-separator" aria-hidden="true">/</span>
        <span className="gs-breadcrumbs-current" aria-current="page">{current}</span>
      </nav>
    </>
  );
}
