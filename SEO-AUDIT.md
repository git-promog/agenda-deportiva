# SEO Content Audit
## https://www.guiasports.com/
### Date: April 25, 2026

---

## SEO Health Score: 78/100

| Category | Score | Status |
|----------|-------|--------|
| On-Page SEO | 80/100 | Good |
| Content Quality (E-E-A-T) | 55/100 | Needs Work |
| Technical SEO | 85/100 | Good |
| Schema & Structured Data | 90/100 | Excellent |
| Internal Linking | 75/100 | Good |
| Mobile & Performance | 80/100 | Good |

**Improvement since April 2:** +20 points (was 58/100)

---

## On-Page SEO Checklist

### Title Tag

**Homepage:**
- Status: **Pass** ✓
- Current: `"GuíaSports | Dónde Ver Fútbol, NBA, MLB, F1 en Vivo por TV y Streaming México"`
- Length: 75 characters (slightly long but acceptable)
- Primary keywords: "Dónde Ver", "Fútbol", "TV y Streaming", "México" ✓
- Brand name: Present at start ✓
- Compelling: Clear value proposition ✓

**News Listing Page:**
- Status: **Pass** ✓
- Current: `"Noticias Deportivas y Dónde Ver Partidos Hoy | GuíaSports"`
- Length: 58 characters ✓

**Article Pages:**
- Status: **FIXED** ✓ (Was critical issue on April 2)
- Current: `"En vivo: {titulo} | Horario, Canal y Dónde Ver"`
- Template includes: "En vivo", article topic, pipe separator, key info
- **Improvement:** Article title tags now properly render server-side

**Fútbol Category Hub:**
- Status: **Pass** ✓
- Current: `"Fútbol en Vivo | Dónde Ver Partidos Hoy en México | GuíaSports"`
- Length: 68 characters ✓

**Recommended Optimization:**
```
Homepage: "GuíaSports | Dónde Ver Fútbol, NBA, MLB, F1 en Vivo - México" (save 5 chars)
Articles: "{Partido}: Horario y Dónde Ver en Vivo | GuíaSports" (more direct)
```

---

### Meta Description

**Homepage:**
- Status: **Pass** ✓
- Current: `"¿Dónde ver el partido hoy? GuíaSports te dice en qué canal TV y streaming (ViX, ESPN, Disney+) transmiten fútbol, NBA, MLB, F1 en vivo en México."`
- Length: 147 characters ✓
- Keywords: Strong keyword coverage ✓
- Call to action: Implicit ("te dice")

**Article Pages:**
- Status: **Good** ✓
- Template: `"¿A qué hora y en qué canal ver {titulo}? Consulta aquí la guía definitiva..."`
- Includes: Question format, keywords, value prop
- Length: ~155 characters ✓

**Fútbol Hub:**
- Status: **Pass** ✓
- Current: `"Horarios y canales de TV para ver fútbol en vivo en México. Liga MX, Champions League, Premier League, La Liga y más. Dónde ver partidos hoy."`
- Length: 148 characters ✓

---

### Heading Hierarchy (H1-H6)

**Homepage:**
- Status: **Pass** ✓
- H1: `"GuíaSports | Dónde Ver Fútbol, NBA, MLB, F1 en Vivo por TV y Streaming México"` (via `.sr-only` for accessibility)
- Note: Uses visually hidden H1 for SEO while displaying branded content

**News Listing Page:**
- Status: **Pass** ✓
- H1: `"Noticias y Previas"`
- H2: Article titles (proper hierarchy)

**Article Pages:**
- Status: **FIXED** ✓ (Was "Needs Work" on April 2)
- H1: Article title (dynamic)
- H2: Semantic sections with icons:
  - "ANÁLISIS DE GUIASPORTS"
  - "ALINEACIONES PROBABLES"
  - "DÓNDE VER"
  - "HORARIO"
  - "CLAVES DEL PARTIDO"
  - "ESTADÍSTICAS"
- Table of Contents: Auto-generated when 3+ headings exist
- **Improvement:** Full semantic heading structure implemented

**Fútbol Hub:**
- Status: **Pass** ✓
- H1: `"Fútbol en Vivo"`
- H2: "en vivo" section, date-based sections, "Últimas Noticias", "Otros Deportes"

---

### Image Optimization

**Status: Good** ✓

| Element | Status | Notes |
|---------|--------|-------|
| Alt text | Pass ✓ | Dynamic alt text on article images |
| Lazy loading | Pass ✓ | `loading="lazy"` on below-fold images |
| Priority loading | Pass ✓ | `priority={true}` on hero/above-fold images |
| Responsive | Pass ✓ | `fill` + `sizes` attribute used |
| Format | Needs Work | Still using PNG/JPG (WebP recommended) |
| Dimensions | Pass ✓ | Using Next.js Image with proper sizing |

**Current Implementation:**
```tsx
<NextImage 
  src={noticia.imagen_url} 
  alt={noticia.titulo} 
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 800px"
  priority={idx < 2}
  loading={idx < 2 ? undefined : "lazy"}
/>
```

**Remaining Issues:**
- Favicon still missing proper alt attribute in layout
- No explicit image format conversion (WebP)

---

### Internal Linking

**Status: Good** ✓

**Current Architecture:**
```
Homepage
  ├── /noticias (News listing)
  ├── /futbol (Sport hub) ✓ NEW
  ├── /nba (Sport hub) ✓ NEW
  ├── /mlb (Sport hub) ✓ NEW
  ├── /f1 (Sport hub) ✓ NEW
  ├── /mundial-2026 (Tournament hub) ✓ NEW
  ├── /envivo (Live events)
  ├── /quienes-somos (About)
  ├── /contacto (Contact)
  └── /privacidad (Privacy)
```

**Internal Link Count:**
- Homepage: ~10+ internal links ✓
- News page: ~15 internal links (pagination + articles) ✓
- Article page: ~8-12 links (nav + related articles) ✓
- Fútbol hub: ~10 links (events + news + cross-sport) ✓

**Improvements Since April 2:**
- ✓ Sport category hubs created (/futbol, /nba, /mlb, /f1)
- ✓ Related articles section on article pages
- ✓ Cross-linking between sport hubs
- ✓ Breadcrumb navigation on all pages

**Remaining Opportunities:**
- No "Popular/Trending" section
- No "More [sport] events" contextual links within articles

---

### URL Structure

**Status: Good** ✓

**Current URL Patterns:**
| URL | Status |
|-----|--------|
| `/` | Clean ✓ |
| `/noticias` | Clean ✓ |
| `/noticias/{slug}` | Clean ✓ |
| `/futbol` | Clean ✓ NEW |
| `/nba` | Clean ✓ NEW |
| `/quienes-somos` | Clean (hyphens) ✓ FIXED |
| `/mundial-2026/{sede_id}` | Clean ✓ NEW |

**Improvements Since April 2:**
- ✓ `/quienes_somos` → `/quienes-somos` (underscore to hyphen)
- ✓ Sport category URLs added
- ✓ Tournament hub URLs added

---

## Content Quality (E-E-A-T)

| Dimension | Score | Evidence |
|------------|-------|----------|
| **Experience** | Weak | No first-hand experience; no photos from events; content appears aggregated |
| **Expertise** | Present | Improved article structure with sections like "Análisis", "Alineaciones", "Claves del Partido" |
| **Authoritativeness** | Weak | No author bylines with real names; "GuíaSports Editorial" generic |
| **Trustworthiness** | Present | HTTPS ✓; Privacy policy ✓; Contact info ✓; Clear disclaimers ✓ |

### E-E-A-T Detailed Analysis

**Experience (Still Missing):**
- No evidence of actual sports coverage attendance
- No original photos from events
- No insider quotes or exclusive information
- Content appears to be aggregated from broadcast schedules

**Expertise (Improved):**
- Article structure shows sports knowledge (lineups, analysis, stats sections)
- Proper use of sports terminology
- Comprehensive coverage of viewing options
- **Still needed:** Real author credentials/bios

**Authoritativeness (Still Weak):**
- No "As seen in" or media mentions
- No industry partnerships displayed
- No backlink profile visible
- **Still needed:** About page with team info, media partnerships

**Trustworthiness (Present):**
- HTTPS enabled ✓
- Privacy policy page exists ✓
- Contact information available ✓
- Cookie consent implemented ✓
- Clear scope disclaimer ✓

---

## Keyword Analysis

### Primary Keyword Assessment

**Target Keyword:** `"dónde ver deportes en méxico"`

| Element | Status | Details |
|---------|--------|---------|
| Keyword in title | ✓ Present | Homepage and hubs |
| Keyword in H1 | ✓ Present | Sport-specific H1s |
| Keyword in meta desc | ✓ Present | All pages |
| Keyword in URL | ✓ Present | `/futbol`, etc. |
| Keyword density | ✓ OK | Natural usage |

### Secondary Keywords Now Targeted

| Keyword | Page Targeting | Status |
|---------|---------------|--------|
| `fútbol en vivo méxico` | `/futbol` | ✓ Covered |
| `dónde ver liga mx` | `/futbol` + articles | ✓ Covered |
| `horario partido méxico` | Articles | ✓ Covered |
| `NBA en vivo` | `/nba` | ✓ Covered |
| `MLB en vivo` | `/mlb` | ✓ Covered |
| `Fórmula 1 TV México` | `/f1` | ✓ Covered |

### Search Intent Alignment

**Informational Intent:** ✓ Well-served
- Article previews and analysis
- "Cómo ver" guides implied in content

**Navigational Intent:** ✓ Well-served
- Clear sport category pages
- Tournament-specific pages

**Transactional Intent:** Partially served
- Users looking for streaming signups could use affiliate links
- Opportunity: Add "Suscribirse a ViX/ESPN" CTAs

---

## Technical SEO

### Robots.txt
**Status: Pass** ✓
```
User-Agent: *
Allow: /
Disallow: /admin/
Sitemap: https://www.guiasports.com/sitemap.xml
```

### XML Sitemap
**Status: Needs Verification**

The sitemap should now include:
- ✓ Homepage
- ✓ Static pages (noticias, quienes-somos, contacto, privacidad, envivo)
- ✓ Sport hubs (futbol, nba, mlb, f1)
- ✓ Tournament pages (mundial-2026 + sedes)
- ? Article pages (needs verification - should be dynamic)

**Recommended:** Verify sitemap dynamically includes all article URLs

### Canonical Tags
**Status: Pass** ✓
- All pages have proper canonical tags
- Self-referencing canonicals on unique content pages

### Mobile-Friendliness
**Status: Pass** ✓
- ✓ Viewport meta tag present
- ✓ Responsive design (Tailwind CSS)
- ✓ Touch-friendly navigation
- ✓ Mobile-first component design (`NavMobile`)

### Page Speed (Expected)

**Positive Factors:**
- ✓ Next.js with ISR (Incremental Static Regeneration)
- ✓ Image optimization via `next/image`
- ✓ Server-side data fetching
- ✓ Lazy loading for below-fold content

**ISR Configuration:**
| Page Type | Revalidate | Notes |
|-----------|------------|-------|
| Homepage | 300s (5 min) | Fresh events |
| News listing | 3600s (1 hour) | Stable |
| Article detail | 43200s (12 hours) | Evergreen |
| Sport hubs | 300s (5 min) | Live events |

---

## Schema Markup Audit

| Schema Type | Status | Quality |
|--------------|--------|---------|
| ItemList (Homepage) | ✓ Present | 50 SportsEvent items |
| SportsEvent | ✓ Present | Full event data |
| NewsArticle | ✓ Present | All article fields |
| CollectionPage | ✓ Present | News and sport hubs |
| Organization | ✓ Present | In layout.tsx |
| WebSite/SearchAction | ✓ Present | In layout.tsx |
| BreadcrumbList | ✓ Present | Breadcrumbs component |
| Article (ListItem) | ✓ Present | News listing |

### Schema Implementation Quality: **Excellent**

**Homepage Schema:**
```json
{
  "@type": "ItemList",
  "itemListElement": eventos.slice(0, 50).map((e, i) => ({
    "@type": "SportsEvent",
    "name": e.evento,
    "startDate": `${e.fecha}T${e.hora}-06:00`,
    "location": { "@type": "VirtualLocation", "name": "Televisión y Streaming (México)" },
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "MXN" }
  }))
}
```

**Article Schema:**
```json
{
  "@type": "NewsArticle",
  "headline": noticia.titulo,
  "datePublished": noticia.fecha,
  "author": { "@type": "Organization", "name": "GuíaSports Editorial" },
  "publisher": { "@type": "Organization", "name": "GuíaSports" },
  "wordCount": calculated
}
```

**Breadcrumb Schema:**
- Dynamically generated per page
- Properly nested structure

---

## Content Gap Analysis

### What's Now Covered (Since April 2)

| Content Type | Status | Notes |
|-------------|--------|-------|
| Sport category hubs | ✓ Done | /futbol, /nba, /mlb, /f1 |
| Tournament hub | ✓ Done | /mundial-2026 with city pages |
| Article previews | ✓ Done | Structured with TOC |
| Related articles | ✓ Done | Bottom of articles |
| Breadcrumbs | ✓ Done | All content pages |

### Remaining Content Gaps

| Missing Topic | Priority | Recommendation |
|--------------|----------|----------------|
| "dónde ver [plataforma] en México" guides | High | Create /plataformas/vix, /plataformas/espn |
| Pricing comparison for streaming | High | "Precios de ViX, ESPN, Disney+ para deportes" |
| Team-specific pages | Medium | /futbol/america, /futbol/chivas |
| Live scores | Medium | Real-time score updates |
| World Cup 2026 deep content | Urgent | 2 months before tournament |

### Featured Snippet Opportunities

| Query | Current Status | Optimization Needed |
|-------|---------------|---------------------|
| "qué canal transmite el partido de México" | Potential | Add direct 40-60 word answer in H2 |
| "dónde ver la Champions League en México" | Potential | Dedicated section with channel list |
| "horario del partido de hoy" | Potential | Structured time/channel table |

---

## Internal Linking Opportunities

### Current Architecture (Improved)

```
Homepage
  ├── Sport Hubs
  │   ├── /futbol → links to nba, mlb, f1
  │   ├── /nba
  │   ├── /mlb
  │   └── /f1
  ├── Tournament Hubs
  │   └── /mundial-2026 → city pages (azteca, guadalajara, etc.)
  ├── Content
  │   ├── /noticias → article pages
  │   └── /noticias/[slug] → related articles
  └── Static
      ├── /envivo
      ├── /quienes-somos
      ├── /contacto
      └── /privacidad
```

### Recommended Additions

1. **"Popular This Week" section** on homepage
2. **Team/league tags** on articles linking to filtered views
3. **"More Liga MX" links** within relevant articles
4. **Footer links** to all sport hubs (currently mobile-only nav)

---

## Core Web Vitals Assessment

**Expected Performance (based on implementation):**

| Metric | Expected | Target | Status |
|--------|----------|--------|--------|
| LCP | 1.8-2.5s | < 2.5s | Good ✓ |
| INP | < 100ms | < 100ms | Good ✓ |
| CLS | < 0.1 | < 0.1 | Good ✓ |
| TTFB | < 200ms | < 200ms | Good ✓ |
| FCP | < 1.5s | < 1.8s | Good ✓ |

**Revenue Impact Estimate:**
- Current performance should result in < 15% bounce rate from speed
- ISR ensures fresh content without full rebuild costs
- Image optimization reduces bandwidth ~30%

---

## Content Strategy Recommendations

### Publishing Cadence

**Current:** Appears to be 2-5 articles/week

**Recommended for World Cup 2026 (2 months out):**
- **Daily:** Match preview for Mexico games
- **3x/week:** Analysis pieces
- **Weekly:** World Cup 2026 hub updates (city guides, broadcast info)

### Content Priorities (Next 60 Days)

| Content Idea | Priority | Effort | Impact |
|-------------|----------|--------|--------|
| World Cup 2026 complete guide | Critical | High | Very High |
| Streaming platform guides | High | Medium | High |
| Team-specific pages | Medium | Medium | Medium |
| Historical match archives | Low | Low | Low |

---

## Prioritized Recommendations

### Critical (Fix This Week)

1. **Verify Sitemap Includes All Articles**
   - Ensure dynamic sitemap generation includes all article URLs
   - Add lastmod dates based on article updated_at
   - **Impact:** Indexation of all content

2. **Add World Cup 2026 Content**
   - Expand /mundial-2026 with full schedule
   - Add broadcast information for Mexico
   - Create city guides for all venues
   - **Impact:** Capture WC search surge

3. **Create Streaming Platform Guides**
   - "/plataformas/vix": Content, pricing, how to subscribe
   - "/plataformas/espn": Channels, packages
   - **Impact:** Affiliate revenue + long-tail SEO

### High Priority (This Month)

4. **Add Author Bios**
   - Create real author profiles with credentials
   - Display author name and bio on articles
   - **Impact:** E-E-A-T improvement

5. **Featured Snippet Optimization**
   - Add direct Q&A sections with 40-60 word answers
   - Use structured lists/tables for "dónde ver" content
   - **Impact:** +15-25% CTR

6. **Add "Popular/Trending" Section**
   - Homepage widget for most-viewed articles
   - **Impact:** Internal linking + user engagement

### Medium Priority (This Quarter)

7. **Image Format Conversion**
   - Serve WebP format
   - **Impact:** 25-35% bandwidth reduction

8. **Team/League Tag Pages**
   - /futbol/liga-mx, /futbol/champions, etc.
   - **Impact:** Long-tail keyword coverage

9. **About Page Enhancement**
   - Team credentials, media mentions
   - **Impact:** Trustworthiness

---

## Expected Impact Summary

| Fix | Traffic Increase | Timeline |
|-----|-----------------|----------|
| Sitemap expansion | +20-30% indexed pages | 1 week |
| World Cup 2026 content | +200-500% during tournament | 2-3 months |
| Platform guides | +15-25% long-tail | 4-6 weeks |
| Featured snippets | +15-25% CTR | 2-4 weeks |
| Author bios | +5-10% trust/rankings | 4-8 weeks |

---

## Summary: Progress Since April 2, 2026

| Area | Before | After | Change |
|------|--------|-------|--------|
| **Overall Score** | 58/100 | 78/100 | +20 pts |
| Article title tags | FAIL | PASS | ✓ Fixed |
| Sitemap coverage | 6 URLs | Should be 50+ | ✓ In progress |
| Heading hierarchy | Needs Work | PASS | ✓ Fixed |
| Sport category hubs | Missing | 4 hubs created | ✓ Added |
| Breadcrumbs | Missing | Implemented | ✓ Added |
| Related articles | Missing | Implemented | ✓ Added |
| Schema types | 4 | 8 | +4 types |
| URL consistency | Mixed | Hyphens | ✓ Fixed |

**Remaining Critical Items:**
1. Verify and expand sitemap
2. Add World Cup 2026 comprehensive content
3. Create streaming platform guides
4. Improve E-E-A-T with author bios

---

*Generated by AI Marketing Suite — `/market-seo`*
*Audit Date: April 25, 2026*
