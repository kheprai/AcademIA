# AcademIA — Manual de Marca

---

## 1. Identidad

### 1.1 Qué es AcademIA

AcademIA es una plataforma de cursos de IA en español, pensada para trabajadores no técnicos de Latinoamérica que sienten que la tecnología los está dejando atrás. No es otra plataforma de cursos online. Es el **escalón cero antes de cualquier otro curso** — el on-ramp para personas que ya probaron tutoriales, se sintieron perdidas, y necesitan que alguien les explique las cosas desde el principio, sin tecnicismos, sin juzgarlos.

### 1.2 Filosofía de marca

**"Para los que sienten que el mundo va más rápido que ellos."**

La marca se construye sobre tres pilares:

1. **Dignidad**: tratamos al usuario con respeto. No es un alumno que "no sabe" — es un profesional con años de experiencia que simplemente no tuvo acceso a la herramienta que le falta. El tono nunca es condescendiente.

2. **Claridad**: todo lo que hacemos se entiende a la primera. Si el usuario tiene que pensar dos veces para entender un botón, un título, o un concepto, fallamos.

3. **Cercanía**: la marca se siente como un cuaderno de notas bien hecho que alguien preparó con cariño. No como una plataforma de Silicon Valley, no como un flyer de agencia, no como un template de Domestika.

### 1.3 Voz y tono

- **Hablamos en segunda persona del singular (vos/tú).** Nunca en plural corporativo ("nosotros ofrecemos").
- **Hablamos en español LATAM neutro**, con inclinación argentina cuando lo amerita (voseo).
- **No usamos jerga técnica** sin explicarla. Si decimos "prompt", lo explicamos inline.
- **No somos aspiracionales vacíos.** No decimos "potenciá tu futuro con IA". Decimos "lo que te lleva 40 minutos, en 5".
- **Usamos humor seco cuando se presta.** "Vas a entender por qué a veces la IA dice boludeces y cómo evitarlo."

### 1.4 Target

| Atributo   | Descripción                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| Edad       | 30-50 años                                                                                            |
| Perfil     | Trabajador no técnico (administrativo, almacenero, contador, logística, pyme, docente, recepcionista) |
| Geografía  | LATAM (foco Argentina, México, Colombia)                                                              |
| Dolor      | Sienten que la tecnología y la IA los dejan atrás. Todo les parece demasiado avanzado.                |
| Motivación | No quedar obsoleto. Mantener o mejorar su posición laboral.                                           |
| Barrera    | Miedo a no entender. Vergüenza de preguntar cosas "básicas".                                          |

---

## 2. Identidad Visual

### 2.1 Dirección estética

**"La Receta"** — warm analog editorial con elementos de estructura visible (checklists, pasos numerados, metadata small-caps), ilustraciones hand-drawn ink, y un solo color accent con presencia.

**No somos:** Anthropic (cream+terracotta+serif editorial). No somos Domestika/Crehana/Platzi (photo-driven marketplace). No somos Nothing (monochrome cold tech).

**Somos:** un cuaderno de notas bien hecho. Alguien se tomó el trabajo de prepararte esto. Dignified, warm, structured, alcanzable.

### 2.2 Logo — Construction Spec

Todas las proporciones del sistema de logo se derivan de una sola unidad base:

> **H** = cap height del wordmark "AcademIA" en Fraunces 600 (la altura de la letra "A").
> A font-size 48px, H ≈ 34px. Todas las medidas escalan proporcionalmente.

#### Isologotipo (isotipo + wordmark, versión principal)

- **Archivos:** `brand/assets/svg/isologotipo/isologotipo-{color,black,white}.svg`
- **Construcción:**
  - Isotipo: **1.8H** de alto (para que el detalle circuital sea legible a todos los tamaños)
  - Gap isotipo → wordmark: **0.35H** (acoplamiento estrecho, son una sola marca)
  - Wordmark: "Academ" text-primary + "IA" accent, Fraunces 600, tracking -0.02em
  - Alineación vertical: isotipo centrado en el centro óptico del wordmark
- **Uso:** hero, headers, materiales principales, presentaciones, donde haya espacio horizontal
- **Clearance mínimo:** **H** en todos los lados del mark completo
- **Tamaño mínimo:** 120px de ancho (digital), 40mm (impreso)

#### Wordmark (solo texto, sin isotipo)

- **Archivos:** `brand/assets/svg/logotipo/logotipo-{color,black,white}.svg`
- **Construcción:** "Academ" + "IA", Fraunces 600, centrado en viewBox
- **Uso:** cuando el espacio horizontal es limitado, header del sitio, footer
- **Clearance mínimo:** **0.75H** en todos los lados
- **Tamaño mínimo:** 80px de ancho (digital), 25mm (impreso)

#### Isotipo (marca gráfica standalone)

- **Archivos PNG:** `brand/assets/isotipo/isotipo-{red,black,white-on-dark}.png` (512x512, trimmed)
- **Archivos SVG:** `brand/assets/svg/isotipo/isotipo-{red,black,white}.svg`
- **Descripción:** gorra de graduación con cerebro circuital (IA). Flat single-color, sin gradientes. Candidato 1 aprobado.
- **Versiones:**
  - **Rojo** (#C0392B) — principal, fondos claros
  - **Negro** (#1F1A15) — formal, impresión monocromática
  - **Blanco** — fondos oscuros
- **Uso:** favicon, app icon, redes sociales (avatar), sello, stickers
- **Clearance mínimo:** **0.5H** (equivale a 1/3 del ancho del isotipo)
- **Tamaño mínimo:** 24px (digital), 10mm (impreso)

#### Tabla de proporciones de referencia

| Font-size | H (cap) | Isotipo (1.8H) | Gap (0.35H) | Clearance (H) |
| --------- | ------- | -------------- | ----------- | ------------- |
| 24px      | 17px    | 31px           | 6px         | 17px          |
| 32px      | 23px    | 41px           | 8px         | 23px          |
| 40px      | 29px    | 52px           | 10px        | 29px          |
| 48px      | 34px    | 61px           | 12px        | 34px          |
| 64px      | 46px    | 83px           | 16px        | 46px          |

#### Reglas de uso

- NUNCA cambiar la proporcion isotipo/wordmark. Si necesitas el logo mas chico, escalá el mark completo.
- NUNCA separar isotipo y wordmark con mas de 0.4H de gap.
- NUNCA poner el isotipo debajo del wordmark (siempre a la izquierda).
- Para uso exclusivo del isotipo (sin wordmark), se puede usar solo cuando el contexto ya establece que es AcademIA (favicon, avatar de perfil, sticker).

### 2.3 Paleta de colores

#### Escala Stone (neutrales cálidos)

Una escala de 10 pasos con undertone warm consistente (hue 30-42). Los tokens existentes caen en posiciones naturales.

| Step | Hex       | Token            | Uso                                          | WCAG vs cream      |
| ---- | --------- | ---------------- | -------------------------------------------- | ------------------ |
| 50   | `#FDFBF7` | —                | Near-white con calidez, backgrounds extremos | —                  |
| 100  | `#FBF8F2` | `--surface`      | Cards sutiles, hover states sobre cream      | —                  |
| 200  | `#F5F0E4` | `--bg-primary`   | Canvas principal, hero, secciones impares    | (base)             |
| 300  | `#E5DFD3` | `--border`       | Bordes de cards, separadores, rules          | —                  |
| 400  | `#C8C0B2` | —                | Disabled, placeholders, iconos sutiles       | 1.6:1 (decorativo) |
| 500  | `#A09789` | `--text-light`   | Labels terciarios, placeholders (large text) | 2.5:1 (large only) |
| 600  | `#70685E` | `--text-muted`   | Subtítulos, meta, captions                   | 4.8:1 AA           |
| 700  | `#574F47` | —                | Secondary headings, strong labels            | 7.1:1 AAA          |
| 800  | `#362F2A` | —                | Dark surfaces, footer alternativo            | —                  |
| 900  | `#1F1A15` | `--text-primary` | Headlines, body text. NO pure #000           | 15.2:1 AAA         |

#### Escala Red (accent)

Una escala de 8 pasos del rojo AcademIA para tintes, estados, y variaciones.

| Step | Hex       | Uso                                       |
| ---- | --------- | ----------------------------------------- |
| 50   | `#FEF2F0` | Background de error/alert states          |
| 100  | `#F9D4D0` | Highlight sutil, badges light             |
| 200  | `#E8958C` | Tags, progress bars light                 |
| 300  | `#D65548` | Secondary accent (poco uso)               |
| 400  | `#C0392B` | **EL accent.** Logo "IA", CTAs, eyebrows. |
| 500  | `#A93226` | Hover de CTAs                             |
| 600  | `#8B2A20` | Active/pressed state                      |
| 700  | `#601C15` | Borders sobre fondo rojo                  |

#### Semantic (armonizados)

Colores funcionales que armonizan con el warm tone del brand. Todos pasan WCAG AA contra blanco.

| Token       | Hex       | Light bg  | Contraste | Nota                                |
| ----------- | --------- | --------- | --------- | ----------------------------------- |
| `--success` | `#357A50` | `#EDF5F0` | 5.2:1     | Warm forest green                   |
| `--warning` | `#A46222` | `#FDF3E8` | 4.8:1     | Warm amber                          |
| `--error`   | `#C0392B` | `#FEF2F0` | 5.4:1     | = brand red (contexto desambigua)   |
| `--info`    | `#2B7D87` | `#EBF5F6` | 4.8:1     | Warm teal (complementario del rojo) |

#### Regla de uso del rojo

El rojo `#C0392B` es el ÚNICO color con presencia en la marca. Se usa exclusivamente en:

- Las letras "IA" del logotipo
- Eyebrow labels de sección
- CTA buttons (fondo sólido)
- Horizontal rules decorativos
- Un solo objeto en cada ilustración
- Error states (el contexto de UI desambigua del accent)
- **En ningún otro lugar.** Si dudás, no lo uses.

### 2.4 Tipografía

| Rol                   | Font              | Weight  | Fuente              |
| --------------------- | ----------------- | ------- | ------------------- |
| **Display / títulos** | Fraunces          | 700-800 | Google Fonts (free) |
| **Body / cuerpo**     | DM Sans           | 400-700 | Google Fonts (free) |
| **Labels / UI**       | DM Sans uppercase | 500-600 | Google Fonts (free) |
| **Mono / accents**    | JetBrains Mono    | 400     | Google Fonts (free) |

**Fraunces** es una serif variable "wonky" old-style — warm, calligráfica, con personalidad. NO es una serif corporativa (no es Times New Roman, no es Garamond, no es Playfair Display). Se usa exclusivamente para headlines y el logotipo web.

**DM Sans** es una humanist sans — friendly, legible para ojos de 40+, con más personalidad que Inter pero menos bouncy que Nunito. Se usa para todo lo demás.

**Escala tipográfica:**

| Token      | Desktop | Mobile |
| ---------- | ------- | ------ |
| display-xl | 64px    | 48px   |
| display-lg | 48px    | 36px   |
| display-md | 32px    | 28px   |
| body-lg    | 20px    | 18px   |
| body-md    | 16px    | 16px   |
| body-sm    | 14px    | 14px   |
| label      | 12px    | 11px   |

### 2.5 Spacing

- **Base unit:** 4px
- **Densidad:** comfortable-spacious (el aire dignifica el contenido)
- **Scale:** 4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128
- **Hero paddings:** 80-120px vertical (desktop)
- **Section paddings:** 64-96px vertical (desktop)

### 2.6 Border radius

| Elemento                    | Radius      |
| --------------------------- | ----------- |
| Inputs, small buttons       | 6px         |
| CTA buttons, tags           | 8px         |
| Cards, overlapping sections | 12px        |
| Headers, sections           | 0px (sharp) |

### 2.7 Favicon & Meta

#### Favicon system

- **SVG favicon** (moderno): isotipo blanco sobre fondo rojo #C0392B con esquinas redondeadas (rx 64). Para browsers modernos.
- **ICO fallback**: 16x16 + 32x32. Mismo diseño.
- **Apple touch icon**: 180x180 PNG, isotipo blanco sobre rojo.
- **Android chrome**: 192x192 + 512x512 PNG para manifest.
- **Theme color**: `#C0392B` (rojo AcademIA). Colorea la barra del browser en mobile.

#### Archivos

| Archivo                  | Tamaño   | Uso                                        |
| ------------------------ | -------- | ------------------------------------------ |
| `favicon.svg`            | vector   | `<link rel="icon" type="image/svg+xml">`   |
| `favicon.ico`            | 16+32    | `<link rel="icon" sizes="32x32">` (legacy) |
| `apple-touch-icon.png`   | 180x180  | `<link rel="apple-touch-icon">`            |
| `android-chrome-192.png` | 192x192  | Web manifest                               |
| `android-chrome-512.png` | 512x512  | Web manifest, splash screen                |
| `og-image.png`           | 1200x630 | `<meta property="og:image">` default       |
| `site.webmanifest`       | —        | PWA manifest                               |

#### Meta tags requeridos

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#C0392B" />
<meta name="description" content="Cursos de IA en español..." />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="AcademIA" />
<meta property="og:image" content="/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="/og-image.png" />
```

#### Reglas

- El lang del HTML es `es` (no `en`)
- Cada pagina publica define su propio `og:title` y `og:description` via el `buildMeta()` helper
- La OG image default (isotipo sobre cream) se usa cuando la pagina no tiene imagen propia
- Para cursos con thumbnail, la OG image es el thumbnail del curso (via `/og-proxy`)

### 2.8 Motion

- **Approach:** minimal-functional
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`
- **Duration:** micro 100ms, short 200ms, medium 350ms, long 500ms
- **Slider hero:** auto-rotate 6s, fade 500ms, pause on hover
- **Scroll reveals:** translateY(16px) + opacity, 350ms
- **Parallax (solo contour bg):** el background de contour lines puede tener parallax sutil (0.3x scroll speed) en heroes y covers. Implementar con `will-change: transform` + `requestAnimationFrame`. Solo aplica al background texture, NUNCA al contenido.
- **NO:** parallax en contenido, scroll-driven choreography, bounce effects

---

## 3. Ilustraciones

### 3.1 Estilo

**"Editorial Ink — Cuaderno Argentino"**

Hand-drawn black ink editorial con trazos visibles, cross-hatching para sombras, imperfecciones humanas. Como una ilustración spot del New Yorker cruzada con un cuaderno de apuntes argentino.

### 3.2 Reglas

- **Tinta:** negro puro (#1A1A1A) para todo, EXCEPTO un solo objeto en rojo AcademIA (#C0392B)
- **Sombreado:** cross-hatching con líneas, NO gradientes, NO fills sólidos
- **Proporciones:** ligeramente estilizadas (editorial, no fotorrealista, no caricatura)
- **Expresión:** focused, dignified, thoughtful. NO sonriendo, NO triste
- **Punto de vista:** 3/4, levemente elevado
- **Fondo:** blanco/vacío. Sin contexto ambiental más allá del workspace inmediato (escritorio, mostrador, silla)
- **Objeto rojo:** exactamente UNO por ilustración (cardigan, delantal, corbata, clipboard, notebook, marcador)

### 3.3 Herramienta de generación

**Nano Banana 2 (Gemini 3.1 Flash Image)** con los prompts documentados en `docs/ILLUSTRATION-FRAMEWORK.md`. Para consistencia, usar el sprite sheet aprobado como imagen seed (`-i` flag).

### 3.4 Archivo de referencia

- **Sprite sheets:** `~/.gstack/projects/kheprai-AcademIA/designs/design-system-20260410/drawings/`
- **Estilo aprobado:** `sprite-01-fineline.png` (fine line, minimal cross-hatching)
- **Ilustraciones individuales generadas:** `~/.gstack/projects/kheprai-AcademIA/designs/design-system-20260410/illustrations/`

---

## 4. Patrones de UI (Signature Patterns)

### 4.1 Checklist visual

Items con `☐` checkbox squares inline + separator `·`. Se usa en el hero para listar requisitos y en secciones de features para beneficios. Es el ELEMENTO FIRMA de la marca.

### 4.2 Small caps metadata

Labels tipo "POCAS HORAS · ONLINE · EN ESPAÑOL" en DM Sans uppercase, tracking wide, color muted. Para metadata de cursos, timestamps, labels de sección.

### 4.3 Eyebrow labels

Texto uppercase en rojo accent antes de cada headline de sección. Formato: "NN / Texto" — numbered progresivamente.

### 4.4 Overlapping card

Card blanca con shadow sutil que cruza el boundary entre dos secciones de distinto color. Contiene el headline de la sección entrante. Funciona como invitación a scrollear.

### 4.5 Ornamental rules

Líneas finas horizontales en `--border` o `--accent` (con emphasis) entre secciones. No decorativas — como puntuación visual.

---

## 5. Background del hero

- **Archivo:** `brand/assets/backgrounds/hero-bg-contour.jpg`
- **Descripción:** líneas topográficas sutiles en warm beige sobre cream. Sugieren movimiento y camino sin ser literales. Cartographic warmth.
- **Uso:** background del hero section en todas las landing pages. Se aplica con `bg-cover bg-center bg-no-repeat`.
- **Es el MISMO para todos los slides del hero** — no cambia por persona.

---

## 6. Aplicaciones

### 6.1 Header del sitio (web público)

- Fondo: transparente → cream/95 + blur + shadow al scrollear (sticky)
- Logo: "AcademIA" en Fraunces, "Academ" oscuro + "IA" rojo
- Nav: DM Sans, color muted → text on hover → red on active
- Layout: logo left, nav center-right, login button far right

### 6.2 Hero slider

- 100dvh, background con textura contour lines
- Slide area fixed height (only eyebrow + headline + subtitle rotan)
- Checklist, metadata, CTA, dots son estáticos (nunca se mueven)
- Ilustración hand-drawn a la derecha, cambia por slide

### 6.3 Footer

- Fondo: `#08080C` (dark)
- Logo: "AcademIA" con "IA" en rojo
- Texto: white/40 - white/70

### 6.4 Login/Register

- Background: `academia-login-bg.jpg` (frame oscuro con circuitos azules)
- Logo centered arriba del form card
- Default cuando no hay upload custom del admin

### 6.5 Splash screen (primera carga)

- Fondo: cream (#F5F0E4)
- Logo "AcademIA" en SVG inline con animación breathing
- Barra roja pulsante debajo
- Se retira con fade cuando fonts + images cargan (max 3s safety)

---

## 7. Lo que NO somos

| Anti-patrón                        | Por qué                               |
| ---------------------------------- | ------------------------------------- |
| Purple gradients                   | AI slop genérico                      |
| 3-column icon grids                | Cookie-cutter SaaS                    |
| Smiling stock photos               | Falso, corporate, Domestika territory |
| Robot/neural network illustrations | Cliché de IA que asusta al target     |
| Centered-everything layouts        | Falta de jerarquía, genérico          |
| Bouncy uniform border-radius       | Infantil, no dignified                |
| Course marketplace cards           | Somos un on-ramp, no un marketplace   |
| Multiple accent colors             | Diluyen la marca. Solo rojo.          |
| Dark mode en landings              | El target no lo usa                   |
| English-first copy                 | Nuestro idioma es español LATAM       |

---

## 8. Assets disponibles

```
brand/
├── BRAND-MANUAL.md          ← este archivo
├── assets/
│   ├── logo/
│   │   ├── academia-logo-horizontal.png   (wordmark + isotipo)
│   │   └── academia-wordmark-only.png     (solo wordmark, sin isotipo)
│   ├── isotipo/
│   │   ├── isotipo-red.png                (rojo #C0392B sobre blanco)
│   │   ├── isotipo-black.png              (negro #1F1A15 sobre transparente)
│   │   └── isotipo-white-on-dark.png      (blanco sobre fondo oscuro)
│   ├── backgrounds/
│   │   ├── hero-bg-contour.jpg            (textura topográfica para hero)
│   │   └── academia-login-bg.jpg          (background del login)
│   ├── illustrations/                      (ver nota abajo)
│   └── favicon/
│       └── app-signet.svg                 (favicon actual)
└── manual/
    └── (PDF del manual generado aquí)
```

**Nota sobre ilustraciones:** las ilustraciones generadas con Nano Banana 2 están en `~/.gstack/projects/kheprai-AcademIA/designs/design-system-20260410/illustrations/`. Copiarlas a `brand/assets/illustrations/` cuando estén aprobadas para uso en producción.

---

## 10. Component Library

Specs de diseño para todos los componentes UI de las páginas públicas. Cada spec define tokens, estados, y reglas. La implementación usa clases Tailwind con el namespace `landing-*`.

### 10.1 Tokens de componente

Además de los tokens de color/tipo ya definidos (sección 2), los componentes usan:

| Token                      | Valor                             | Uso                                 |
| -------------------------- | --------------------------------- | ----------------------------------- |
| `shadow-landing-sm`        | `0 1px 3px rgba(31,26,21,0.06)`   | Cards en reposo, inputs             |
| `shadow-landing-md`        | `0 4px 16px rgba(31,26,21,0.08)`  | Cards hover, dropdowns              |
| `shadow-landing-lg`        | `0 8px 40px rgba(31,26,21,0.10)`  | Modals, overlapping cards           |
| `shadow-landing-red`       | `0 2px 8px rgba(192,57,43,0.25)`  | CTA button                          |
| `shadow-landing-red-hover` | `0 4px 16px rgba(192,57,43,0.30)` | CTA button hover                    |
| `radius-sm`                | `6px`                             | Inputs, small buttons, badges       |
| `radius-md`                | `8px`                             | CTA buttons, tags, dropdowns        |
| `radius-lg`                | `12px`                            | Cards, overlapping sections         |
| `radius-none`              | `0px`                             | Sections, headers (sharp editorial) |

---

### 10.2 Buttons

Cuatro variantes, tres tamaños. El botón primary es el ÚNICO elemento de interacción en rojo.

#### Primary (CTA)

- **Fondo:** `red-400` (#C0392B)
- **Texto:** white, DM Sans 600
- **Radius:** `radius-md` (8px)
- **Shadow:** `shadow-landing-red`
- **Hover:** fondo `red-500`, shadow `shadow-landing-red-hover`, translateY(-1px)
- **Active:** fondo `red-600`, shadow none, translateY(0)
- **Disabled:** fondo `stone-400`, texto `stone-600`, cursor not-allowed

#### Secondary (outline)

- **Fondo:** transparent
- **Borde:** 1px `stone-300`
- **Texto:** `stone-900`, DM Sans 600
- **Hover:** fondo `stone-100`, borde `stone-400`
- **Active:** fondo `stone-200`

#### Ghost

- **Fondo:** transparent
- **Texto:** `stone-600`
- **Hover:** fondo `stone-100`, texto `stone-900`

#### Link

- **Texto:** `stone-600`, underline `stone-300`, underline-offset 4px
- **Hover:** texto `stone-900`, underline `stone-900`

#### Tamaños

| Size | Padding     | Font-size | Height |
| ---- | ----------- | --------- | ------ |
| S    | `8px 16px`  | 13px      | 32px   |
| M    | `12px 24px` | 15px      | 40px   |
| L    | `14px 32px` | 15px      | 48px   |

---

### 10.3 Card (base)

Contenedor universal para course cards, news cards, service cards, etc.

- **Fondo:** white (#FFFFFF)
- **Borde:** 1px `stone-300` (#E5DFD3)
- **Radius:** `radius-lg` (12px)
- **Shadow:** none en reposo
- **Hover:** borde `red-400`, shadow `shadow-landing-md`, translateY(-2px)
- **Padding:** 0 (el contenido define su propio padding interno)
- **Overflow:** hidden (para que thumbnails respeten el radius)
- **Transición:** all 200ms ease-out

**Variante cream:**

- Fondo: `stone-200` (#F5F0E4) en vez de white
- Uso: cards sobre fondo blanco

**Variante elevated (overlapping):**

- Shadow: `shadow-landing-lg`
- Margin-top: negativo (-48px a -72px)
- Uso: overlapping cards entre secciones

---

### 10.4 Input

Campos de texto para search bars, contact forms, checkout.

- **Fondo:** white
- **Borde:** 1px `stone-300`
- **Radius:** `radius-sm` (6px)
- **Texto:** `stone-900`, DM Sans 400, 15px
- **Placeholder:** `stone-500`
- **Padding:** `10px 12px` (M), `8px 10px` (S)
- **Focus:** borde `red-400`, ring 2px `red-50`, outline none
- **Error:** borde `red-400`, ring 2px `red-50`, helper text en `red-400`
- **Disabled:** fondo `stone-100`, texto `stone-500`, cursor not-allowed
- **Icon slot:** padding-left 40px cuando hay icono (search, etc.)

**Search variant:**

- Icono search (`stone-400`) a la izquierda
- Placeholder: "Buscar..." en `stone-500`
- Radius: `radius-md` (8px) — más redondeado que inputs normales

**Textarea:**

- Mismos tokens que input
- Min-height: 120px
- Resize: vertical

---

### 10.5 Select (dropdown)

- Mismos tokens base que Input (borde, radius, fondo, focus)
- Chevron icon a la derecha en `stone-400`
- Dropdown panel: fondo white, borde `stone-300`, shadow `shadow-landing-md`, radius `radius-md`
- Option hover: fondo `stone-100`
- Option selected: fondo `red-50`, texto `red-400`

---

### 10.6 Badge / Tag

Etiquetas para categorías, estados, idiomas, precios.

#### Category badge

- Fondo: `stone-100`
- Texto: `stone-700`, DM Sans 500, 12px uppercase, tracking 0.05em
- Padding: `4px 10px`
- Radius: `radius-sm` (6px)

#### Status badge

- **Enrolled:** fondo `success-light`, texto `success`
- **Purchased:** fondo `info-light`, texto `info`
- **Free:** fondo `red-50`, texto `red-400`
- **New:** fondo `warning-light`, texto `warning`
- Padding: `4px 8px`, radius `radius-sm`, font 11px 600 uppercase

#### Language badge

- Fondo: `stone-100`
- Emoji flag + código de idioma
- Padding: `4px 8px`, radius `radius-sm`
- **Active:** ring 2px `red-400`

#### Price badge

- **Gratis:** texto `success`, font 700
- **Con precio:** texto `stone-900`, font 700
- **Precio tachado:** texto `stone-500`, line-through, font 400
- **Descuento:** fondo `red-50`, texto `red-400`, font 600

---

### 10.7 Page Hero (listing headers)

Sección header reutilizable para `/courses`, `/news`, `/resources`, `/faq`, etc.

- **Fondo:** `stone-200` (cream)
- **Padding:** `64px 0` desktop, `48px 0` mobile
- **Título:** Fraunces 700, `display-lg` (48px/36px), `stone-900`
- **Subtítulo:** DM Sans 400, `body-lg` (20px/18px), `stone-600`
- **Max-width título:** 640px
- **Eyebrow** (opcional): DM Sans 600, 12px uppercase, `red-400`, tracking 0.1em
- **Search** (opcional): debajo del subtítulo, max-width 480px, mt-24px
- **Alineación:** left (no centered)

---

### 10.8 Pagination

- **Container:** flex, gap 8px, items-center
- **Page button:** 36x36px, radius `radius-sm`, DM Sans 500, 14px
- **Default:** fondo transparent, texto `stone-600`
- **Hover:** fondo `stone-100`
- **Active:** fondo `red-400`, texto white
- **Disabled (prev/next):** opacity 0.4, cursor not-allowed
- **Prev/Next:** mismo estilo + chevron icon

---

### 10.9 Empty State

Cuando no hay resultados o contenido.

- **Container:** centered, padding `64px 24px`
- **Icono:** 48x48px, `stone-400`, opacity 0.5
- **Título:** DM Sans 600, 18px, `stone-700`
- **Descripción:** DM Sans 400, 15px, `stone-600`, max-width 400px
- **CTA** (opcional): botón secondary, mt-24px

---

### 10.10 Breadcrumb / Back nav

- **Texto:** DM Sans 500, 14px, `stone-600`
- **Arrow:** chevron-left icon, `stone-400`
- **Hover:** texto `red-400`
- **Container:** mb-24px

---

### 10.11 Section

Alternancia de secciones cream/white con padding consistente.

- **Cream section:** fondo `stone-200`
- **White section:** fondo white
- **Padding:** `80px 0` desktop, `48px 0` mobile
- **Inner max-width:** 1280px, padding horizontal `24px`
- **Separador** (opcional): hr 1px `stone-300`, margin `48px 0`
- **Eyebrow + heading pattern:** eyebrow en `red-400` uppercase → heading Fraunces 700 → subtitle DM Sans `stone-600`

---

### 10.12 Course Card

El componente más importante de la plataforma. Se usa en `/courses`, `/courses/category/:slug`, y featured sections.

#### Estructura base

- **Base:** Card (10.3) con overflow hidden
- **Thumbnail:** aspect-video, object-cover, fondo `stone-100` (fallback)
- **Thumbnail hover:** scale 1.03, transition 300ms
- **Body padding:** `16px`
- **Category badge:** posición absoluta top-right del thumbnail, offset `8px`
- **Status badge:** posición absoluta top-left del thumbnail, offset `8px`
- **Title:** Fraunces 600, 18px, `stone-900`, line-clamp 2
- **Description** (opcional): DM Sans 400, 14px, `stone-600`, line-clamp 2, mt-4px
- **Meta row:** flex, items-center, gap 8px, mt-8px
  - Chapter count: icono book + "5 capítulos", DM Sans 400, 13px, `stone-600`
  - Language flags: emoji badges
- **Left border indicator:**
  - Default: sin borde
  - Enrolled (no purchased): borde izquierdo 3px `success`
  - Purchased: borde izquierdo 3px `info`

#### Footer: 9 estados de acción

El footer cambia según el estado de compra/enrollment. Siempre: border-top 1px `stone-300`, padding `12px 16px`, flex justify-between items-center.

| #   | Estado                                       | Precio (izq)                    | Acción (der)                                                |
| --- | -------------------------------------------- | ------------------------------- | ----------------------------------------------------------- |
| 1   | **Gratis, no inscripto**                     | "Gratis" en `success` 700       | Primary S: "Inscribite gratis"                              |
| 2   | **Gratis, inscripto**                        | — (oculto)                      | Secondary S: "Continuar" → `/course/:slug`                  |
| 3   | **Pago, tiene preview gratis, no inscripto** | "USD X" / "ARS X" DM Sans 700   | Split buttons: Secondary S "Preview" + Primary S "Comprar"  |
| 4   | **Pago, sin preview, no inscripto**          | "USD X" / "ARS X" DM Sans 700   | Primary S: "Agregar al carrito" (icono cart)                |
| 5   | **Pago, inscripto pero no comprado**         | "USD X" DM Sans 700             | Primary S: "Comprar curso" (icono lock)                     |
| 6   | **En carrito**                               | "USD X" DM Sans 500 `stone-600` | Primary S: "Ir al checkout" + Ghost icon: trash `stone-400` |
| 7   | **Comprado**                                 | — (oculto)                      | Secondary S: "Ir al curso" → `/course/:slug`                |

**Split button (estado 3):**

- Dos botones S pegados sin gap, border-radius solo en los extremos exteriores
- "Preview": fondo `stone-100`, texto `stone-700`, borde derecho 1px `stone-300`
- "Comprar": fondo `red-400`, texto white
- Hover individual en cada mitad

**Precio dual-currency:**

- Formato: "USD 1" + separador `·` + "ARS 1.200"
- Logos: icono Stripe (8px) / MercadoPago (8px) al lado de cada precio
- Si solo un método: mostrar solo ese
- DM Sans 700 para el precio principal, DM Sans 400 13px `stone-500` para el secundario

#### Course Card (compact)

Para sidebars, "cursos relacionados", listados secundarios.

- **Layout:** horizontal, flex row, height 80px
- **Thumbnail:** 80x80px, aspect-square, radius-left `radius-lg`
- **Content:** padding `8px 12px`, flex-1
- **Title:** DM Sans 600, 14px, `stone-900`, line-clamp 2
- **Price:** DM Sans 600, 13px, `stone-700`
- **CTA:** sin botón, toda la card es clickeable

#### Course Card (featured / hero)

Para category landings y homepage featured sections. Full-width, prominence maxima.

- **Layout:** horizontal en desktop (`1.4fr 1fr`), stack en mobile
- **Height:** min 320px desktop
- **Thumbnail:** columna izquierda, aspect-video, object-cover, radius-left `radius-lg`
- **Content padding:** `32px 40px`
- **Category badge:** inline, arriba del título
- **Title:** Fraunces 700, `display-md` (32px), `stone-900`, line-clamp 2
- **Description:** DM Sans 400, `body-lg`, `stone-600`, line-clamp 3, mt-12px
- **Meta:** chapter count + language + duration, DM Sans 400, 14px, `stone-500`, mt-16px
- **Price:** DM Sans 700, 24px, `stone-900`, mt-16px
- **CTA:** botón primary size M, mt-16px
- **Background:** fondo white o `stone-100`
- **Shadow:** `shadow-landing-md`

---

### 10.26 Course Detail — Price Sidebar

El sidebar sticky de la página de detalle del curso. Mismos 7 estados de acción pero con más espacio y detalle.

- **Container:** Card elevated, padding `24px`, position sticky top `96px`, width 360px
- **Thumbnail mini** (opcional): aspect-video, radius `radius-md`, mb-16px

#### Estados del sidebar

**Estado 1 — Gratis:**

- Precio: "Gratis" Fraunces 700, 36px, `success`
- CTA: Primary L full-width "Inscribite gratis"
- Sub-CTA: link style "Ver contenido del curso"

**Estado 2 — Gratis, inscripto:**

- Mensaje: "Ya estás inscripto" DM Sans 600, 16px, `success` con icono check
- CTA: Primary L full-width "Ir al curso"

**Estado 3 — Pago con preview:**

- Precio: "USD 1" Fraunces 700, 36px, `stone-900`
- Precio secundario: "ARS 1.200" DM Sans 400, 16px, `stone-500` debajo
- Logos de payment providers al lado de cada precio
- CTA stack vertical:
  - Primary L full-width "Comprar curso"
  - Secondary L full-width "Preview gratis" (mt-8px)
- Nota: "Probá los capítulos gratuitos antes de comprar" DM Sans 400, 13px, `stone-500`, mt-12px

**Estado 4 — Pago sin preview:**

- Precio: igual que estado 3
- CTA: Primary L full-width "Agregar al carrito"
- Secondary L full-width "Comprar ahora" (mt-8px)

**Estado 5 — Inscripto, no comprado:**

- Mensaje: "Estás en el preview gratuito" badge `success-light`/`success`
- Precio: "USD 1" Fraunces 700, 36px
- CTA: Primary L full-width "Comprar acceso completo"
- Nota: "Desbloqueá todos los capítulos" DM Sans 400, 13px, `stone-500`

**Estado 6 — En carrito:**

- Mensaje: "En tu carrito" badge `info-light`/`info` con icono cart
- CTA: Primary L full-width "Ir al checkout"
- Ghost L full-width "Quitar del carrito" (mt-8px, texto `stone-500`)

**Estado 7 — Comprado:**

- Mensaje: "Curso completo" badge `success-light`/`success` con icono check-circle
- CTA: Primary L full-width "Ir al curso"
- Sin precio

#### Stats section (debajo del CTA en todos los estados)

- Separador: hr `stone-300`, mt-20px mb-16px
- Lista vertical, gap 12px:
  - Icono `stone-400` 16px + texto DM Sans 400, 14px, `stone-600`
  - "5 capítulos" (book icon)
  - "Pocas horas" (clock icon)
  - "Certificado incluido" (award icon) — solo si `hasCertificate`
  - "Nivel principiante" (bar-chart icon)
  - "En español" (globe icon)

---

### 10.27 Category Landing — Featured Course Showcase

Pattern para las category landing pages (`/courses/category/:slug`). Muestra cursos promocionados de la categoría con prominence alta.

#### Hero featured (single course)

Un curso destacado en formato hero dentro de la category landing, debajo del category hero.

- **Container:** Section white, padding `64px 0`
- **Eyebrow:** "CURSO DESTACADO" DM Sans 600, 12px uppercase, `red-400`
- **Layout:** Card featured/hero (10.12 variante featured)
- **Uso:** cuando la categoría tiene 1 curso principal que se quiere destacar

#### Featured slider (múltiples cursos)

Carrusel de cursos destacados en formato grande.

- **Container:** Section cream, padding `64px 0`, overflow hidden
- **Eyebrow:** "CURSOS EN [CATEGORÍA]" DM Sans 600, 12px uppercase, `red-400`
- **Title:** Fraunces 700, `display-md`, `stone-900`
- **Slider:** horizontal scroll / swipe, gap 24px
  - Cards: Course Card featured/hero (10.12 variante featured), min-width 560px
  - Snap: scroll-snap-type x mandatory, scroll-snap-align start
- **Navigation:** dot indicators `stone-300` / `red-400` active, debajo del slider
- **Arrows** (desktop only): circular buttons 40x40, fondo white, borde `stone-300`, shadow `shadow-landing-sm`
  - Hover: borde `red-400`
  - Position: absolute, centrado vertical, offset -20px fuera del container

#### Grid de cursos de la categoría

Debajo del featured, el listado completo.

- **Container:** Section white, padding `64px 0`
- **Eyebrow:** "TODOS LOS CURSOS"
- **Grid:** 3 columnas desktop, 2 tablet, 1 mobile
- **Cards:** Course Card standard (10.12)
- **Empty state:** si no hay cursos en la categoría, EmptyState (10.9) con CTA "Ver todos los cursos"

---

### 10.13 News Card

Para `/news` listing.

- **Base:** Card (10.3) con overflow hidden
- **Cover image:** aspect-video, object-cover, fondo `stone-100`
- **Body padding:** `20px`
- **Date + Author:** DM Sans 400, 13px, `stone-500`, separados con `·`
- **Title:** Fraunces 600, 20px, `stone-900`, line-clamp 2, mt-8px
- **Summary:** DM Sans 400, 14px, `stone-600`, line-clamp 3, mt-4px
- **Hover title:** color `red-400`

#### News Card (featured)

Para el primer item en `/news`.

- **Layout:** horizontal en desktop (imagen left 60%, content right 40%), stack en mobile
- **Fondo:** `stone-900` (dark)
- **Image:** aspect-video, width 100% en su columna
- **Badge:** "Destacado" en `red-400`, fondo `red-50`, position absolute
- **Title:** Fraunces 700, `display-md` (32px), white, mt-12px
- **Summary:** DM Sans 400, 16px, white/70
- **Meta:** DM Sans 400, 13px, white/40
- **CTA:** botón secondary (outline) con borde white/20, texto white
- **Radius:** `radius-lg`

---

### 10.14 Article Card

Para `/resources` listing.

- **Base:** Card (10.3)
- **Padding:** `20px`
- **Title:** DM Sans 600, 16px, `stone-900`
- **Section context** (opcional): DM Sans 400, 13px, `stone-500`, arriba del título
- **Hover title:** color `red-400`
- **Sin imagen** — solo texto

---

### 10.15 Service Card

Para `/servicios` grid.

- **Base:** Card (10.3)
- **Padding:** `24px`
- **Icon slot:** 40x40px, fondo `red-50`, radius `radius-md`, icono en `red-400`
- **Title:** DM Sans 700, 16px, `stone-900`, mt-16px
- **Description:** DM Sans 400, 14px, `stone-600`, mt-8px
- **Arrow:** posición bottom-right, `stone-400`, transition → `red-400` on hover
- **Hover:** icon slot fondo `red-100`

---

### 10.16 Tool Card

Para `/tools` listing.

- **Base:** Card (10.3)
- **Padding:** `24px`
- **Logo** (opcional): max-height 32px, grayscale → full color on hover
- **Name:** DM Sans 700, 18px, `stone-900`
- **Offer badge** (opcional): inline badge `red-50` + `red-400` text, font 11px 600
- **Description:** DM Sans 400, 14px, `stone-600`, mt-8px
- **Price row:** flex, items-baseline, gap 8px, mt-12px
  - Price actual: DM Sans 700, 20px, `stone-900`
  - Price original: DM Sans 400, 14px, `stone-500`, line-through
  - Period: DM Sans 400, 13px, `stone-500`
- **CTA:** botón secondary size S, mt-16px, external link icon

---

### 10.17 Course Detail Layout

La página de mayor conversión. Layout two-column en desktop.

- **Fondo:** `stone-200` (cream) para el hero area, white para el contenido
- **Grid:** `1fr 360px` en desktop (content + sidebar), stack en mobile
- **Breadcrumb:** arriba del título
- **Thumbnail:** aspect-video, radius `radius-lg`, max-width 100%, shadow `shadow-landing-sm`
- **Category + Language:** flex row con badges, mt-16px
- **Title:** Fraunces 800, `display-lg`, `stone-900`, mt-16px
- **Description:** DM Sans 400, `body-md`, `stone-700`, mt-16px (rich text)
- **Chapter list:** mt-32px, cada chapter es un accordion

---

### 10.18 Chapter Accordion

- **Container:** borde 1px `stone-300`, radius `radius-lg`, overflow hidden
- **Header:** padding `16px 20px`, fondo white, flex between
  - Title: DM Sans 600, 16px, `stone-900`
  - Chapter number: DM Sans 500, 13px, `stone-500`
  - Chevron: `stone-400`, rotates 180° on open
  - Freemium badge: badge `success-light`/`success` "Gratis"
- **Content:** padding `0 20px 16px`
- **Separador entre chapters:** borde-top 1px `stone-300`
- **Transición:** height 200ms ease-out (accordion-down)

---

### 10.19 Lesson Row

Dentro del chapter accordion.

- **Container:** flex, items-center, padding `10px 0`, gap 12px
- **Type icon:** 20x20px
  - Content: file-text icon, `stone-500`
  - Quiz: help-circle icon, `warning`
  - AI Mentor: bot icon, `info`
  - Embed: external-link icon, `stone-500`
- **Title:** DM Sans 400, 14px, `stone-700`
- **Lock indicator:** lock icon `stone-400` cuando no accessible
- **Hover:** fondo `stone-50` con radius `radius-sm`

---

### 10.20 Price Sidebar (sticky)

Sidebar derecho en course detail.

- **Container:** Card elevated, padding `24px`, position sticky top `96px`
- **Price:** Fraunces 700, 36px, `stone-900`
- **Currency note:** DM Sans 400, 13px, `stone-500`
- **CTA:** botón primary size L, width 100%, mt-16px
- **Secondary CTA:** botón ghost, width 100%, mt-8px
- **Stats:** mt-24px, lista vertical
  - Cada stat: flex, gap 8px, icono `stone-400`, texto DM Sans 400 14px `stone-600`
  - Capítulos, duración, certificado, nivel
- **Separador:** hr `stone-300` entre precio y stats

---

### 10.21 Article Detail Layout

Para `/news/:id` y `/resources/:id`.

- **Max-width content:** 720px, centered
- **Cover image:** aspect-video, radius `radius-lg`, width 100%, shadow `shadow-landing-sm`
- **Meta bar:** flex, gap 8px, DM Sans 400, 13px, `stone-500`, mt-24px
  - Author name, `·`, date
- **Title:** Fraunces 700, `display-lg`, `stone-900`, mt-16px
- **Summary:** DM Sans 400, `body-lg`, `stone-600`, mt-12px, italic
- **Content:** DM Sans 400, `body-md`, `stone-700`, mt-32px, prose styling
- **Prev/Next:** flex between, mt-48px, botones secondary con chevrons

---

### 10.22 FAQ Accordion

Para `/faq`.

- **Container:** max-width 800px
- **Item:** borde-bottom 1px `stone-300`
- **Question (header):** padding `20px 0`, flex between
  - Texto: DM Sans 600, 16px, `stone-900`
  - Plus/minus icon: `stone-400`, transition rotate
- **Answer (content):** padding `0 0 20px`, DM Sans 400, 15px, `stone-600`, line-height 1.7
- **Hover question:** texto `red-400`

---

### 10.23 Cart Item Card

Para `/cart`.

- **Layout:** flex row, gap 16px, padding `16px`, borde-bottom 1px `stone-300`
- **Thumbnail:** 80x80px, radius `radius-md`, object-cover
- **Content:** flex-1
  - Title: DM Sans 600, 16px, `stone-900`
  - Author + Category: DM Sans 400, 13px, `stone-500`
- **Price:** DM Sans 700, 18px, `stone-900`, text-right
- **Remove button:** icon-only ghost, trash icon `stone-400`, hover `red-400`

---

### 10.24 Checkout Form

Para `/checkout`.

- **Layout:** grid `1fr 400px` desktop (form + order summary), stack mobile
- **Form sections:** separadas por hr `stone-300`, padding `24px 0`
- **Section title:** DM Sans 700, 18px, `stone-900`, mb-16px
- **Fields:** Input (10.4) specs, grid 2-col cuando aplica
- **Payment method selector:** radio buttons con card styling
  - Card fondo white, borde `stone-300`, padding `16px`, radius `radius-md`
  - Selected: borde `red-400`, fondo `red-50`
  - Logo del provider + nombre
- **Order summary:** Card elevated, padding `24px`, position sticky
  - Items: compact list
  - Separador: hr `stone-300`
  - Total: DM Sans 700, 24px, `stone-900`
  - CTA: botón primary size L, width 100%

---

### 10.25 Estados y feedback

#### Loading skeleton

- Fondo: `stone-200`
- Animación: pulse (opacity 0.5 → 1), 1.5s infinite
- Forma: replica el layout del componente (aspect-ratio, border-radius, gaps)

#### Success state

- Icono: check-circle, `success`, 48px
- Título: Fraunces 600, 24px, `stone-900`
- Descripción: DM Sans 400, 15px, `stone-600`
- Fondo: `success-light` para el icon container

#### Toast

- Fondo: `stone-900`, texto white, radius `radius-md`
- Success: borde-left 4px `success`
- Error: borde-left 4px `red-400`
- Warning: borde-left 4px `warning`
- Info: borde-left 4px `info`
- Shadow: `shadow-landing-lg`
- Animación: slideIn from right, 300ms

#### Contact Form (planificado)

- Usa specs de Input (10.4), Select (10.5), Button (10.2)
- Campos: nombre, email, asunto (select), mensaje (textarea)
- Layout: single column, max-width 560px
- Submit: botón primary size L, width 100%
- Success: reemplaza form con Success state

---

## 9. Registro de decisiones

| Fecha      | Decisión                                    | Contexto                                                                                                                                                   |
| ---------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-10 | Estilo "La Receta" aprobado                 | Design consultation con 20+ variantes. Elegido por colores warm, estructura visible, single red accent.                                                    |
| 2026-04-10 | Fraunces + DM Sans como sistema tipográfico | Fraunces por warmth wonky (no overused). DM Sans por legibilidad 40+ años.                                                                                 |
| 2026-04-10 | Rojo #C0392B como único accent              | Diferenciador vs Anthropic (terracotta), cursos LATAM (multicolor), Nothing (monochrome).                                                                  |
| 2026-04-10 | Ilustraciones fine-line ink editorial       | Sprite-01 aprobado. New Yorker + cuaderno argentino.                                                                                                       |
| 2026-04-10 | Background contour lines                    | bg-04 elegido por balance subtileza + carácter + metáfora cartográfica.                                                                                    |
| 2026-04-10 | Header light/cream (no dark)                | Matching mockup aprobado "La Receta". Logo texto, no PNG.                                                                                                  |
| 2026-04-10 | Isotipo flat single-color                   | Tres variantes (rojo, negro, blanco). Generados con Nano Banana 2.                                                                                         |
| 2026-04-10 | Isotipo candidate-1 aprobado                | Gorra de graduación + cerebro circuital. Elegido entre 3 candidatos generados con Nano Banana 2. candidate-1 por claridad de forma y balance visual.       |
| 2026-04-10 | SVGs con Fraunces + Google Fonts @import    | Logotipo y isologotipo SVGs usan Fraunces con fallback Georgia. Brand manual HTML usa inline text para consistencia (SVG `<img>` no carga fonts externas). |

---

_Manual generado el 2026-04-10. Source of truth: `brand/BRAND-MANUAL.md` en el repo._
_Para cambios, actualizar este archivo y notificar al equipo._
