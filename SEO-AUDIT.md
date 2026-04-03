# SEO Content Audit
## https://www.guiasports.com/
### Date: April 2, 2026

---

## SEO Health Score: 58/100

| Category | Score | Status |
|----------|-------|--------|
| On-Page SEO | 55/100 | Needs Work |
| Content Quality (E-E-A-T) | 45/100 | Weak |
| Technical SEO | 60/100 | Needs Work |
| Schema & Structured Data | 70/100 | Good |
| Internal Linking | 50/100 | Needs Work |
| Mobile & Performance | 65/100 | Good |

---

## On-Page SEO Checklist

### Title Tag

**Homepage:**
- Status: **Pass** ✓
- Current: `"GuíaSports - Agenda Deportiva y Dónde Ver Deportes Hoy en México"`
- Length: 66 characters (within optimal range 50-60 displayed, 66 acceptable)
- Primary keyword: "Agenda Deportiva", "Dónde Ver Deportes" ✓
- Brand name: Present ✓
- Compelling: Functional but could be more action-oriented

**News Listing Page:**
- Status: **Pass** ✓
- Current: `"Noticias y Previas Deportivas | GuíaSports"`
- Length: 42 characters (could be longer)

**Article Page (CRITICAL ISSUE):**
- Status: **FAIL** ✗
- Current: `"Noticia no encontrada - GuíaSports"`
- Expected: `"México vs Bélgica: Amistoso de Alto Calibre ¡Imperdible! | GuíaSports"`
- **Issue:** Title tag shows "Noticia no encontrada" (article not found) instead of the actual article headline. This is blocking proper indexing of ALL article pages.

**Recommended Fix:**
```
Homepage: "GuíaSports | Dónde Ver Fútbol, NBA, MLB, F1 en Vivo por TV y Streaming México"
News: "Noticias Deportivas y Dónde Ver Partidos Hoy | GuíaSports"
Articles: "[Article Headline] | Horario y Canal TV | GuíaSports"
```

---

### Meta Description

**Homepage:**
- Status: **Pass** ✓
- Current: `"Encuentra en qué canal de TV y plataformas de streaming ver fútbol, F1, MLB, NBA y más eventos deportivos en vivo desde México. La mejor guía deportiva."`
- Length: 145 characters (optimal: 150-160)
- Keywords: "fútbol", "streaming", "en vivo", "México" ✓
- Call to action: Could be stronger

**News Listing:**
- Status: **Pass** ✓
- Current: `"Lee las mejores previas, análisis y noticias deportivas de México. Fútbol, F1, MLB, NBA y más. Información actualizada sobre dónde ver deportes en vivo."`
- Length: 153 characters ✓

**Article Page:**
- Status: **Needs Work**
- Current: Generic site description, not article-specific
- **Issue:** Meta description should be unique per article and include the article topic

**Recommended Fix:**
```
Homepage: "¿Dónde ver el partido hoy? GuíaSports te dice en qué canal TV y streaming (ViX, ESPN, Disney+) transmiten fútbol, NBA, MLB, F1 en vivo en México."
Articles: "Horario y dónde ver en vivo [Partido]: canales TV, streaming y plataforma. [Evento] hoy [fecha] por [competicion]. GuíaSports México."
```

---

### Heading Hierarchy (H1-H6)

**Homepage:**
- Status: **Needs Work**
- Issue: H1 not visible in server-rendered HTML (client-side JavaScript rendering)
- This affects SEO crawlers that may not execute JavaScript

**News Listing Page:**
- Status: **Pass** ✓
- H1: `"Noticias y Previas"` (correct - one H1)
- H2: Article titles (correct hierarchy)

**Article Page:**
- Status: **Needs Work**
- H1: `"México vs Bélgica: Amistoso de Alto Calibre ¡Imperdible!"` ✓
- H4: `"¿Te sirvió la guía?"` (skipping H2, H3)
- **Issue:** No semantic H2/H3 structure for article sections
- Article content uses divs instead of proper headings

**Current Structure:**
```
H1: México vs Bélgica...
  [content in divs, no H2/H3]
  H4: ¿Te sirvió la guía?
```

**Recommended Structure:**
```
H1: México vs Bélgica: Horario y Dónde Ver
  H2: Fecha y Hora del Partido
  H2: Dónde Ver en Vivo
    H3: Opciones de TV Abierta
    H3: Opciones de Streaming
  H2: Análisis y Previo
  H2: Alineaciones Probables
```

---

### Image Optimization

**Status: Needs Work**

| Image | Alt Text | Status |
|-------|----------|--------|
| `/GuiaSports-logo.svg` | "GuíaSports" | Pass ✓ |
| `unsplash-photo-...` | "México vs Bélgica..." | Pass ✓ |
| `/noticia_ia_preview.png` | Article headline | Pass ✓ |
| `/favicon.ico` | Missing | Fail ✗ |

**Issues:**
- Favicon missing alt attribute
- No WebP format detected (using PNG/JPG)
- No lazy loading attributes detected
- No explicit width/height attributes (CLS risk)

**Recommendations:**
1. Add `width` and `height` attributes to all images
2. Implement `loading="lazy"` for below-fold images
3. Convert to WebP format for 25-35% size reduction
4. Add `fetchpriority="high"` to hero images

---

### Internal Linking

**Status: Needs Work**

**Current Internal Links (Homepage):**
| Destination | Anchor Text | Type |
|-------------|--------------|------|
| `/` | Inicio | Navigation |
| `/noticias` | Noticias | Navigation |
| `/quienes_somos` | Quiénes Somos | Navigation |
| `/privacidad` | Privacidad | Navigation |
| `/contacto` | Contacto | Navigation |

**Issues:**
- No breadcrumb navigation
- No related articles section on article pages
- No category pages (by sport: /futbol, /nba, /mlb)
- No "Popular" or "Trending" internal links
- Navigation links use generic anchor text

**Internal Link Count:**
- Homepage: ~5 internal links (low)
- News page: ~7 internal links
- Article page: ~5 internal links

**Recommendation:** Add 10-20 contextual internal links per page, especially:
- Related articles by sport
- "More [sport] events" links
- Category hub pages

---

### URL Structure

**Status: Needs Work**

**Current URL Patterns:**
| URL | Issue |
|-----|-------|
| `/noticias` | Clean ✓ |
| `/quienes_somos` | Uses underscore instead of hyphen |
| `/noticias/mexico-vs-belgica-...` | Clean ✓ |
| `/envivo` | Clean ✓ |

**Issues:**
1. **Inconsistent separators:** Some URLs use `_` (quienes_somos), others use `-`
2. **No category structure:** Articles don't have sport category in URL
   - Current: `/noticias/article-slug`
   - Better: `/futbol/mexico-vs-belgica-horario-canal`
3. **Spanish characters:** URLs handle accents properly ✓

**Recommendations:**
1. Standardize on hyphens (redirect old URLs)
2. Add sport category to article URLs
3. Create category hub pages: `/futbol`, `/nba`, `/mlb`, `/f1`

---

## Content Quality (E-E-A-T)

| Dimension | Score | Evidence |
|------------|-------|----------|
| **Experience** | Weak | No first-hand experience demonstrated; no personal anecdotes, photos, or evidence of direct sports coverage |
| **Expertise** | Weak | No author credentials; "GuíaSports Editorial" is generic; no sports journalism credentials displayed |
| **Authoritativeness** | Weak | No media mentions; no backlink profile visible; no industry recognition; no partnerships with broadcasters |
| **Trustworthiness** | Present | HTTPS ✓; Privacy policy ✓; Clear contact email ✓; No registration required; Disclaimer about not broadcasting |

### E-E-A-T Detailed Analysis

**Experience (Missing):**
- No evidence of actual sports coverage experience
- No photos from events
- No insider knowledge demonstrated
- Content appears AI-generated or aggregated

**Expertise (Weak):**
- Author listed as "GuíaSports Editorial" (organization, not person)
- No author bio with credentials
- No sports journalism background displayed
- Analysis content is superficial (2-3 sentences)

**Authoritativeness (Weak):**
- No "About" page with team information
- No media mentions or press coverage
- No industry awards or recognition
- No partnerships with official broadcasters

**Trustworthiness (Present):**
- HTTPS enabled ✓
- Privacy policy present ✓
- Contact information available ✓
- Clear disclaimer about service scope ✓
- No personal data collection ✓

**Recommendations to Improve E-E-A-T:**
1. Add author bylines with real names and bios
2. Create detailed "About" page with team credentials
3. Add "As seen in" or media mentions section
4. Partner with broadcasters for official badges
5. Include more detailed analysis showing sports expertise

---

## Keyword Analysis

### Primary Keyword Assessment

**Target Keyword:** `"dónde ver deportes en méxico"` (where to watch sports in Mexico)

| Element | Status | Details |
|---------|--------|---------|
| Keyword in title | ✓ Present | "Dónde Ver Deportes Hoy en México" |
| Keyword in H1 | ✗ Missing | H1 doesn't contain primary keyword |
| Keyword in meta desc | ✓ Present | "en qué canal... ver fútbol..." |
| Keyword in URL | ✗ Missing | URL is brand name only |
| Keyword in first 100 words | ✓ Present | Appears early in content |
| Keyword density | ✓ OK | Natural usage, no stuffing |

### Secondary Keywords to Target

| Keyword | Search Intent | Priority |
|---------|----------------|----------|
| agenda deportiva hoy | Informational | High |
| dónde ver el partido | Informational | High |
| canal [equipo] hoy | Navigational | High |
| horario [partido] méxico | Informational | High |
| streaming fútbol méxico | Commercial | Medium |
| qué canal transmite [liga] | Informational | Medium |
| ver [equipo] en vivo | Transactional | Medium |

### Search Intent Analysis

**Current Intent Alignment:** Informational/Navigational

The page serves users who want to know **where** to watch sports. Content matches this intent well:
- ✓ Provides channel and platform information
- ✓ Lists multiple viewing options
- ✓ Includes times and dates

**Potential Intent Mismatches:**
- Users searching for live streams may land here expecting to watch
- Should clarify more prominently: "Guía de canales - No transmitimos eventos"

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

- ✓ Allows all crawlers
- ✓ Blocks admin area
- ✓ References sitemap
- ✓ No CSS/JS blocking

### XML Sitemap

**Status: CRITICAL ISSUE** ✗

```xml
<urlset>
  <url><loc>https://www.guiasports.com</loc></url>
  <url><loc>https://www.guiasports.com/noticias</loc></url>
  <url><loc>https://www.guiasports.com/quienes_somos</loc></url>
  <url><loc>https://www.guiasports.com/privacidad</loc></url>
  <url><loc>https://www.guiasports.com/contacto</loc></url>
  <url><loc>https://www.guiasports.com/envivo</loc></url>
</urlset>
```

**Critical Issues:**
1. **Only 6 URLs indexed** - Missing ALL article pages
2. **All lastmod dates identical** (2026-04-02T03:39:51.736Z) - Suggests placeholder
3. **Missing sport-specific pages** - No /futbol, /nba, etc.
4. **No image sitemap**

**Impact:** Article pages are not being submitted to search engines, severely limiting discoverability.

**Recommended Fix:** Generate dynamic sitemap including:
- All article URLs
- Sport category pages (when created)
- Accurate lastmod dates
- Image sitemap for article images

### Canonical Tags

**Status: Pass** ✓

- Homepage: `<link rel="canonical" href="https://www.guiasports.com">`
- Articles: Self-referencing canonical present

### Mobile-Friendliness

**Status: Pass** ✓

- ✓ Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- ✓ Responsive design (Tailwind CSS)
- ✓ No horizontal scrolling required
- ✓ Touch-friendly navigation

### Page Speed (Estimated)

**Concerns:**
- Client-side JavaScript rendering for main content
- Loading skeleton states visible (JavaScript-dependent)
- SportsEvent schema rendered client-side

**Expected Metrics:**
| Metric | Estimated | Target |
|--------|-----------|--------|
| LCP | 2.5-3.5s | < 2.5s |
| FID/INP | 100-200ms | < 100ms |
| CLS | 0.1-0.2 | < 0.1 |
| TTFB | 200-400ms | < 200ms |

**Recommendations:**
1. Server-side render homepage event listings
2. Preload critical fonts and images
3. Add explicit image dimensions
4. Defer non-critical JavaScript

---

## Schema Markup Audit

| Schema Type | Status | Quality |
|--------------|--------|---------|
| ItemList (Homepage) | Present ✓ | Good - 50 SportsEvent items |
| SportsEvent | Present ✓ | Good - name, date, sport, location |
| NewsArticle | Present ✓ | Good - headline, date, author, wordCount |
| CollectionPage | Present ✓ | Good - news listing |
| Organization | Missing ✗ | Should add |
| WebSite/SearchAction | Missing ✗ | Should add |
| BreadcrumbList | Missing ✗ | Should add |

### Current Schema Strengths:
- ✓ SportsEvent schema well-implemented with 50+ events
- ✓ NewsArticle schema with proper fields
- ✓ Correct JSON-LD format

### Missing Critical Schemas:

**Organization Schema (Recommended):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GuíaSports",
  "url": "https://www.guiasports.com",
  "logo": "https://www.guiasports.com/GuiaSports-logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contacto@promographic.com.mx",
    "contactType": "customer service"
  }
}
```

**WebSite Schema with SearchAction (Recommended):**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GuíaSports",
  "url": "https://www.guiasports.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.guiasports.com/buscar?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## Content Gap Analysis

### Missing Content Topics

| Topic | Search Volume | Competition | Content Type | Priority |
|-------|---------------|-------------|--------------|----------|
| "dónde ver liga mx hoy" | High | Medium | Daily guide | 1 |
| "horario partido méxico" | High | High | Event pages | 1 |
| "canales de deportes en méxico" | Medium | Low | Evergreen guide | 2 |
| "cómo ver [plataforma] en méxico" | Medium | Low | Platform guides | 2 |
| "agenda world cup 2026" | High (growing) | Medium | Tournament hub | 2 |
| "mejores apps para ver deportes" | Medium | High | Comparison | 3 |
| "precio streaming deportes méxico" | Medium | Medium | Pricing guide | 3 |

### Competitor Content Gaps

Competitors (TUDN, ESPN, Fútbol En Vivo) have:
- Team-specific pages
- League-specific landing pages
- Historical match archives
- Live scoreboards
- Prediction/content sections

GuíaSports is missing all of these content opportunities.

---

## Featured Snippet Opportunities

### Current Opportunities

| Query | Snippet Type | Current Ranking | Optimization |
|-------|--------------|-----------------|--------------|
| "qué canal transmite méxico hoy" | Paragraph | Not ranking | Add direct answer in H2 + 40-60 word response |
| "dónde ver champions league méxico" | List/Paragraph | Not ranking | Create dedicated guide with channel list |
| "horario partido méxico vs bélgica" | Paragraph | Potential | Add structured answer with time, channel, platform |

### Featured Snippet Optimization Template

**For "qué canal transmite [partido]" queries:**

```html
<h2>¿Qué canal transmite México vs Bélgica en México?</h2>
<p>México vs Bélgica se transmite el [fecha] a las [hora] por los canales TUDN, Canal 5 y Azteca Deportes en TV abierta. En streaming está disponible en ViX Premium y TUDN app.</p>

<ul>
  <li><strong>TV Abierta:</strong> TUDN (Canal 5), Azteca Deportes</li>
  <li><strong>TV de Paga:</strong> TUDN, SKY Sports</li>
  <li><strong>Streaming:</strong> ViX Premium, TUDN app</li>
</ul>
```

---

## Internal Linking Opportunities

### Current Architecture

```
Homepage
  |-- /noticias (News listing)
       |-- Article 1
       |-- Article 2
  |-- /quienes_somos
  |-- /contacto
  |-- /privacidad
  |-- /envivo (Live events)
```

### Recommended Architecture

```
Homepage
  |-- Sport Hubs (NEW)
       |-- /futbol
           |-- /futbol/liga-mx
           |-- /futbol/champions-league
           |-- /futbol/premier-league
       |-- /nba
       |-- /mlb
       |-- /f1
       |-- /box
  |-- /noticias
       |-- Article (links to relevant sport hub)
       |-- "Relacionado" section (NEW)
  |-- /plataformas (NEW)
       |-- ViX guide
       |-- Disney+ sports
       |-- ESPN México
  |-- /envivo
  |-- /calendario (NEW)
```

### Specific Link Improvements

| Page | Current Links | Recommended Additions |
|------|---------------|------------------------|
| Homepage | 5 nav links | Add sport category cards linking to hubs |
| Article | 5 nav + 1 related | Add: Related articles, Sport hub link, Platform links |
| News listing | Nav only | Add: Sport filter links, Date navigation |
| 404 page | Minimal | Add: Popular articles, Search, Home link |

---

## Content Strategy Recommendations

### Publishing Cadence

**Current:** ~2 articles/week (minimal)

**Recommended:**
- **Daily:** Event preview for major events
- **3x/week:** Analysis articles (previews, reviews)
- **Weekly:** Evergreen content (guides, comparisons)
- **Monthly:** Platform/pricing updates

### Content Types Needed

1. **Event Preview Pages** (high priority)
   - Template: "México vs [Opponent]: Horario, Canal y Dónde Ver"
   - Include: Time, channels, streaming platforms, preview

2. **Sport Category Hubs** (high priority)
   - /futbol, /nba, /mlb, /f1
   - Aggregates all content for that sport

3. **Platform Guides** (medium priority)
   - "Cómo ver ViX en México: Precios y Contenido Deportivo"
   - "ESPN México: Canales, Programación y Cómo Contratar"

4. **Evergreen Content** (medium priority)
   - "Canales Deportivos en México: Guía Completa 2026"
   - "Mejores Plataformas de Streaming para Ver Deportes"

5. **World Cup 2026 Hub** (urgent - 3 months before)
   - Host city guides
   - Ticket information
   - Broadcast schedule
   - Travel tips

### Content Length Recommendations

| Content Type | Current | Recommended |
|--------------|---------|-------------|
| Event previews | ~300 words | 600-1,000 words |
| Analysis articles | ~300 words | 1,000-1,500 words |
| Platform guides | N/A | 2,000+ words |
| Category hubs | N/A | 1,500+ words |

---

## Prioritized Recommendations

### Critical (Fix Immediately)

**1. Fix Article Title Tags**
- **Issue:** All article pages show "Noticia no encontrada" in title
- **Impact:** Blocking all article SEO indexing
- **Fix:** Implement server-side title generation
- **Effort:** 2-3 hours

**2. Expand Sitemap**
- **Issue:** Only 6 URLs in sitemap
- **Impact:** Article pages not submitted to search engines
- **Fix:** Generate dynamic sitemap with all content
- **Effort:** 2-4 hours

**3. Add Semantic Heading Structure**
- **Issue:** Articles lack H2/H3 hierarchy
- **Impact:** Poor content structure for SEO and accessibility
- **Fix:** Add proper heading structure to article template
- **Effort:** 2-3 hours

### High Priority (This Month)

**4. Create Sport Category Hubs**
- Create /futbol, /nba, /mlb, /f1 pages
- Link from homepage and articles
- Target category-level keywords

**5. Add Missing Schema Types**
- Organization schema
- WebSite with SearchAction
- BreadcrumbList

**6. Fix URL Convention**
- Redirect `/quienes_somos` to `/quienes-somos`
- Standardize on hyphens throughout

**7. Add Internal Linking**
- Related articles section
- Sport hub links on articles
- "Popular events" on homepage

### Medium Priority (This Quarter)

**8. Content Expansion**
- Publish 3-5 articles per week
- Create platform guides
- Build World Cup 2026 hub

**9. Featured Snippet Optimization**
- Add direct Q&A format answers
- Structure content for snippet capture

**10. Image Optimization**
- Convert to WebP
- Add lazy loading
- Add explicit dimensions

### Low Priority (When Resources Allow)

**11. E-E-A-T Improvements**
- Add author bios
- Create detailed About page
- Pursue media mentions

**12. Performance Optimization**
- Server-side render key content
- Reduce JavaScript bundle size

---

## Expected Impact

| Fix | Expected Traffic Increase | Timeline |
|-----|---------------------------|----------|
| Fix article titles | +50-100% article impressions | 2-4 weeks |
| Expand sitemap | +30-50% indexed pages | 1-2 weeks |
| Add category hubs | +20-40% category traffic | 4-8 weeks |
| Content expansion | +100%+ organic traffic | 3-6 months |
| Featured snippet wins | +15-25% click-through rate | 2-4 weeks |

---

*Generated by AI Marketing Suite — `/market-seo`*