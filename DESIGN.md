# Design System — AcademIA

## Product Context

- **What this is:** Plataforma B2C de cursos de IA en español para LATAM
- **Who it's for:** Trabajadores no técnicos 30-50 que sienten que la tecnología los deja atrás
- **Space/industry:** Ed-tech LATAM, segmento "on-ramp" (el escalón antes de cualquier otro curso)
- **Project type:** Homepage + landing pages públicas + authenticated app (admin/dashboard)
- **This system applies to:** El homepage de AcademIA y las landing pages públicas. La app interna admin/dashboard mantiene el UI existente (Radix + Tailwind).
- **Homepage vs landings:** El homepage ES la web principal de AcademIA donde se promocionan cursos (incluido el curso principal que todavía no tiene nombre final). Las category landing pages, course detail, news, resources, etc. heredan el mismo sistema visual.

## Aesthetic Direction

- **Direction:** "La Receta" — warm analog editorial con elementos de estructura visible (checklists, pasos numerados, metadata small-caps), ilustraciones hand-drawn ink, y un solo color accent con presencia
- **Decoration level:** Intentional — ornamentos funcionales (checkboxes, horizontal rules, small caps labels, numbered steps), no decorativos vacíos
- **Mood:** Dignified, warm, structured, alcanzable. "Alguien se tomó el trabajo de prepararte esto." Ni tech-bro, ni condescendiente, ni corporate. Como un cuaderno de notas bien hecho que alguien te preparó con cariño.
- **Reference:** `~/.gstack/projects/kheprai-AcademIA/designs/design-system-20260410/fresh-1-receta.png`
- **Anti-references:** Anthropic (cream+terracotta+serif editorial), Domestika/Crehana/Platzi (photo-driven marketplace), Nothing (monochrome cold tech)

## Typography

- **Display/Hero:** **Fraunces** (Google Fonts, free, Undercase Type) — warm "wonky" old-style serif con curvas suaves y stroke variable. Se siente como un título de libro de cocina o de un cuaderno de notas cuidado. Alternativa si Fraunces no funciona: Bespoke Serif (Pangram Pangram).
- **Body:** **DM Sans** (Google Fonts, free) — humanist sans con x-height generoso, lee fácil para ojos de 40+, más personality que Inter sin ser bouncy.
- **UI/Labels:** DM Sans en small caps y uppercase para eyebrows, metadata, labels de sección.
- **Data/Tables:** DM Sans con `font-variant-numeric: tabular-nums` para datos tabulares.
- **Code:** JetBrains Mono (si se necesita en algún contexto técnico).
- **Loading:** Google Fonts CDN para Fraunces (variable, opsz) + DM Sans. Self-host si performance lo requiere.
- **Scale:**
  - `display-xl` 64px / 48px mobile (hero headline en el slider)
  - `display-lg` 48px / 36px mobile (headlines de secciones)
  - `display-md` 32px / 28px mobile (sub-headlines)
  - `body-lg` 20px (lead paragraphs, supporting copy)
  - `body-md` 16px (default body)
  - `body-sm` 14px (meta, captions, secondary info)
  - `label` 12px uppercase tracking-wide (eyebrows, section labels, "PASO 1", "PREPARACIÓN")

## Color

- **Approach:** Restrained con un solo accent statement. El rojo warm es el ÚNICO color con presencia. Todo lo demás es neutral warm.
- **`--bg-primary`** `#F5F0E4` — warm cream, the main canvas. Hero sections, odd-numbered sections.
- **`--bg-secondary`** `#FFFFFF` — pure white. Even-numbered sections, cards, overlapping elements.
- **`--bg-surface`** `#FBF8F2` — lighter cream for subtle card backgrounds or hover states on cream.
- **`--text-primary`** `#1F1A15` — warm near-black para headlines y body. NO pure #000.
- **`--text-muted`** `#70685E` — warm taupe para meta, captions, secondary info. (4.8:1 vs cream, WCAG AA)
- **`--text-on-accent`** `#FFFFFF` — white text on red accent backgrounds (CTA buttons).
- **`--accent`** `#C0392B` — warm deep red. EL color del brand. Se usa en:
  - Las letras "IA" del logo "AcademIA"
  - Eyebrow labels de sección
  - CTA buttons (fondo sólido)
  - Horizontal rules decorativos (finos, en puntos clave)
  - Small accent details en ilustraciones (un objeto rojo en la mano del personaje)
  - **NOWHERE ELSE.** Si dudás si algo debería ser rojo, probablemente no.
- **`--accent-hover`** `#A93226` — red más oscuro para hover de CTA.
- **`--border`** `#E5DFD3` — warm beige sutil para borders de cards, inputs, separadores.
- **Semantic (warmed, WCAG AA on white):** success `#357A50` (warm forest), warning `#A46222` (warm amber), error `#C0392B` (= brand red), info `#2B7D87` (warm teal, complementario del rojo).
- **Semantic light backgrounds:** success-light `#EDF5F0`, warning-light `#FDF3E8`, error-light `#FEF2F0`, info-light `#EBF5F6`.
- **Stone scale completa:** 50 `#FDFBF7` · 100 `#FBF8F2` · 200 `#F5F0E4` · 300 `#E5DFD3` · 400 `#C8C0B2` · 500 `#A09789` · 600 `#70685E` · 700 `#574F47` · 800 `#362F2A` · 900 `#1F1A15`. See `brand/BRAND-MANUAL.md` 2.3 for full spec and WCAG ratios.
- **Dark mode:** NO aplica a las webs públicas en esta fase. Si se agrega después, reducir saturación del red 15-20% y invertir los backgrounds (cream→dark, white→darker).

## Spacing

- **Base unit:** 4px
- **Density:** Comfortable-spacious (el aire es intencional — dignifica el contenido)
- **Scale:** 4(xs) · 8(sm) · 16(md) · 24(lg) · 32(xl) · 48(2xl) · 64(3xl) · 96(4xl) · 128(5xl)
- **Hero padding:** 80-120px vertical, 64-96px horizontal (desktop). Reducir proporcionalmente en mobile.
- **Section padding:** 64-96px vertical (desktop).
- **Between elements en hero:** 16-24px entre eyebrow→headline, 16px entre headline→support, 24px entre support→CTA, 8px entre CTA→secondary link.

## Layout

- **Approach:** Asymmetric editorial, NOT centered-everything SaaS. Contenido alineado izquierda como regla, illustration/visual derecha como complemento.
- **Grid:** 12 columnas, max-width `1280px`, gutters `24px` (desktop) / `16px` (mobile).
- **Hero layout:** 55-60% texto izquierda, 40-45% visual derecha. En mobile: stack vertical, visual arriba (más chica), texto abajo.
- **Hero es un SLIDER:** cada slide habla a un persona distinto del target con: eyebrow + headline específico + supporting copy + CTA + ilustración hand-drawn. Rota entre: administrativa, almacenero, contador, empleado de logística, pyme. Transición: fade o slide horizontal sutil, con indicator dots en accent red.
- **Header:** Se mantiene la estructura actual del `LandingHeader.tsx`: sticky dark `bg-[#08080C]/80 backdrop-blur-xl`, logo AcademIA (versión white via brightness-0 invert porque el header es dark), nav links con dropdown dinámico para "Cursos" (via `useMenuCategories()` — muestra categorías configuradas con `showInMenu`, cada una como link a `/courses/category/${slug}`, con separator + "Ver todos los cursos" al final), más los otros nav items existentes. El header NO se rediseña — su estructura de código actual es correcta, solo heredará las fonts (DM Sans para nav links) de este design system.
- **Overlapping card transition:** entre secciones (cream→white o white→cream), una card con border-radius `12px`, subtle box-shadow (`0 4px 24px rgba(0,0,0,0.08)`), padding `32px 40px`, se superpone ~40-60px sobre el boundary de las dos secciones. Contiene el headline de la sección siguiente (ej: "PASO 1 — Entender qué es una IA"). Este patrón se repite en cada transición de sección.
- **Border radius:** `6px` (inputs, small buttons) · `8px` (CTA buttons, tags) · `12px` (cards, overlapping sections) · `0px` (no rounded en headers, sections — edges sharp para peso editorial).
- **Max content width:** `1280px`. Contenido de texto max `720px` para legibilidad (~65ch).

## Logo Construction

Todas las proporciones del logo se derivan de **H** = cap height del wordmark "AcademIA" en Fraunces 600.

- **Isologotipo** (isotipo + wordmark): isotipo **1.8H** alto, gap **0.35H**, clearance **H**
- **Wordmark** (solo texto): clearance **0.75H**, centrado horizontal
- **Isotipo** (standalone): clearance **0.5H**, min 24px digital / 10mm impreso
- **Alineación vertical:** isotipo centrado en el centro óptico del wordmark
- **Regla:** NUNCA cambiar la proporción. Escalar el mark completo, no las partes.

| Font-size | H    | Isotipo | Gap  | Clearance |
| --------- | ---- | ------- | ---- | --------- |
| 24px      | 17px | 31px    | 6px  | 17px      |
| 32px      | 23px | 41px    | 8px  | 23px      |
| 40px      | 29px | 52px    | 10px | 29px      |
| 48px      | 34px | 61px    | 12px | 34px      |

Source of truth visual: `brand/BRAND-MANUAL.md` sección 2.2.

## Component Tokens

Tokens adicionales para el component library. Definidos en `tailwind.config.ts` bajo `landing-*`.

### Shadows

- `shadow-landing-sm`: `0 1px 3px rgba(31,26,21,0.06)` — cards en reposo, inputs
- `shadow-landing-md`: `0 4px 16px rgba(31,26,21,0.08)` — cards hover, dropdowns
- `shadow-landing-lg`: `0 8px 40px rgba(31,26,21,0.10)` — modals, overlapping cards
- `shadow-landing-red`: `0 2px 8px rgba(192,57,43,0.25)` — CTA button
- `shadow-landing-red-hover`: `0 4px 16px rgba(192,57,43,0.30)` — CTA hover

### Radius (inherited from spec)

- `6px` — inputs, small buttons, badges
- `8px` — CTA buttons, tags, dropdowns
- `12px` — cards, overlapping sections
- `0px` — sections, headers (sharp editorial)

### Component Spec Source

La spec completa de los 25 componentes (buttons, cards, inputs, badges, course cards, news cards, accordions, pagination, empty states, toasts, etc.) está en `brand/BRAND-MANUAL.md` sección 10. El brand manual HTML tiene ejemplos vivos renderizados.

## Motion

- **Approach:** Minimal-functional con un toque de slide para el hero slider.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro 100ms (hover, focus) · short 200ms (button transitions) · medium 350ms (card reveals on scroll) · long 500ms (hero slider transition).
- **Hero slider:** auto-rotate cada 6 segundos, pausar on hover, con dots indicator. Transition: fade crossfade 500ms.
- **Scroll reveals:** cards y secciones aparecen con un subtle translateY(16px) → translateY(0) + opacity 0 → 1 al entrar al viewport. Duración 350ms. NO en el hero (ya visible).
- **Parallax (excepcion):** SOLO el background contour-lines puede tener parallax sutil (0.3x scroll speed) en heroes y covers. `will-change: transform` + `requestAnimationFrame`. NUNCA en contenido.
- **NO:** parallax en contenido, scroll-driven choreography, entrance animations complejas, bounce effects.

## Illustration Style

- **Technique:** Hand-drawn ink editorial (black ink strokes con cross-hatching para sombras, trazos visibles, imperfecciones humanas). NO flat vector. NO corporate stock illustration. NO AI-generated "perfect" illustrations.
- **Color in illustrations:** Monocromático black ink EXCEPTO un solo objeto del personaje en accent red `#C0392B` (el lápiz, el cuaderno, el delantal, la corbata — un elemento que identifica al personaje).
- **Subjects por slide del hero:**
  - Administrativa: mujer ~45 en su escritorio con laptop y papeles
  - Almacenero: hombre ~50 detrás de mostrador con estantes
  - Contador: hombre ~55 en escritorio con calculadora y formularios
  - Logística: persona ~40 con casco y pallet de cajas
  - Pyme: persona ~45 en mesita chica con laptop y café
- **Production:** Las ilustraciones se pueden generar con Nano Banana 2 (Gemini 3.1 Flash Image) usando prompts específicos por personaje, o comisionar a un ilustrador. El style guide es: "New Yorker spot illustration meets cuaderno de apuntes argentino."

## Signature Patterns

- **Checklist visual:** items con `☐` checkbox squares inline + dot separator `·`. Se usa en el hero para listar "requisitos" y en secciones de features para listar beneficios. Es el SIGNATURE ELEMENT visual del brand.
- **Small caps metadata:** labels como "PREPARACIÓN: 5 semanas · PORCIONES: 1 trabajador nivelado" en DM Sans uppercase tracking-wide, `--text-muted`. Se usa para metadata de cursos, timestamps, section labels.
- **Eyebrow labels:** texto uppercase en `--accent` red antes de cada headline de sección. Formato: "01 / TEXTO" o "PASO 1 — Texto". Numbered progresivamente.
- **Overlapping card:** card blanca con shadow sutil que cruza el boundary entre dos secciones de distinto color. Contiene el headline de la sección entrante. Funciona como "invitación a scrollear" y como separador con depth.
- **Horizontal rules ornamentales:** finas líneas en `--border` o `--accent` (cuando hay emphasis) entre secciones. No como decoration vacía — como punctuation visual.

## Decisions Log

| Date       | Decision                                            | Rationale                                                                                                                                                                                                                                                                                  |
| ---------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-04-10 | Estilo "La Receta" aprobado como dirección visual   | Proceso de design consultation con 20+ variantes exploradas. Elegido por: colores warm, estructura visible (checklists, pasos), illustration hand-drawn, card overlapping transition, single red accent. No literal receta — el concepto vive en los tokens y patterns, no en la metáfora. |
| 2026-04-10 | Hero = slider con personas del target               | Cada slide habla a un persona distinto del target (administrativa, almacenero, contador, logística, pyme). Rotativo automático con dots indicator.                                                                                                                                         |
| 2026-04-10 | Red accent `#C0392B` como ÚNICO color con presencia | Diferenciador vs Anthropic (terracotta), vs cursos LATAM (multicolor), vs Nothing (monochrome). Warm red = urgencia + dignidad + correction-pencil nostálgico.                                                                                                                             |
| 2026-04-10 | Fraunces como display serif                         | Warm, wonky, approachable, con optical-size variable. No overused. Free en Google Fonts.                                                                                                                                                                                                   |
| 2026-04-10 | Anti dark-mode para landings en esta fase           | El target user no usa dark mode. Agregar después si métricas lo justifican.                                                                                                                                                                                                                |
| 2026-04-10 | Isotipo candidate-1 aprobado                        | Gorra de graduación + cerebro circuital. Generado con Nano Banana 2. PNGs trimmed a 91% content fill.                                                                                                                                                                                      |
| 2026-04-10 | Logo construction spec: H-based proportions         | Isotipo 1.5H, gap 0.4H, clearance H. Derivado de cap height del wordmark. Evita px arbitrarios.                                                                                                                                                                                            |
| 2026-04-10 | Overlapping card como pattern de transición         | El elemento más elogiado del mockup aprobado. Se repite en toda la landing.                                                                                                                                                                                                                |
| 2026-04-10 | Stone scale 10-step + Red scale 8-step              | Escala completa de neutrales warm (50-900) con WCAG compliance. Stone-600 ajustado a #70685E (4.8:1 vs cream). Red 50-700 para tints de alerts y estados.                                                                                                                                  |
| 2026-04-10 | Semantic colors armonizados                         | Success #357A50, Warning #A46222, Info #2B7D87. Todos warm, todos WCAG AA on white. Error = brand red #C0392B.                                                                                                                                                                             |
| 2026-04-10 | Component library: 25 component specs               | Auditoría de 23 páginas públicas. Specs forward-looking (incluye componentes planificados). Brand manual HTML con ejemplos vivos.                                                                                                                                                          |
| 2026-04-10 | Tailwind landing-\* tokens expandidos               | Stone scale, red scale, semantic colors, shadow tokens, todo en tailwind.config.ts bajo namespace `landing`.                                                                                                                                                                               |
