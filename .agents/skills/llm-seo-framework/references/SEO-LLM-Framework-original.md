¿El fin del CMS tradicional?: cómo construí un flujo de contenido "Agent-Native" para Mostrador
En el 2010 creé mi primer blog usando WordPress y luego de eso no me detuve. Aprendí y desarrollé muchas cosas en relación al CMS y webs.
Durante años, aceptamos que gestionar un blog significaba pelear con interfaces lentas, bases de datos pesadas y un montón de plugins que prometían mucho y cumplian poco.
Si hoy seguís gestionando tus sitios de esa manera, estás perdiendo velocidad y eficiencia.
Esta semana en Mostrador, decidí cambiarme el chip sobre lo que entendía por CMS y encontrar la mejor forma de convertirme en el director de orquesta de lo que sucede entre mis ideas y el Agente de IA.
El primer paso fue diseñar una Skill personalizada para mi agente que transforma la creación de contenido en un "proceso de ingeniería de software" puro, eficiente y, sobre todo, rápido.
La idea surgió de una manera muy simple: si me voy a comunicar con una máquina, por qué no hacerlo por canales donde ella se sienta cómoda y de forma nativa. -> sentido común básico XD
Dejame contarte los detalles sobre cómo funciona este sistema y por qué el futuro del contenido no pasa tanto por escribir, sino ejecutar infraestructura para sacarle el mayor beneficio.

1. Filosofía: la "Tercera Audiencia"
Dries Buytaert (creador de Drupal) publicó recientemente el concepto de "The Third Audience", y es el pilar sobre el que construí el blog de Mostrador.
Tradicionalmente, optimizábamos para dos audiencias:
Humanos: Necesitan diseño visual, legibilidad y accesibilidad.
Motores de Búsqueda: Necesitan metadatos, sitemaps y estructura HTML.
Hoy existe una tercera: Los Agentes de IA (LLMs).
Estos agentes (Claude, ChatGPT, Perplexity) no quieren navegar por menús desplegables, ni esquivar pop-ups, ni parsear <div> innecesarios para encontrar el texto. Ellos quieren datos puros, estructurados y limpios.
Así que tiene bastante sentido servir el contenido de esta manera.
¿Cómo lo estoy haciendo?
HTML para humanos y SEO tradicional.
Markdown limpio para Agentes de IA.
Armé un auto-discovery, donde cada página HTML incluye esto:
<link rel="alternate" type="text/markdown" href="https://blog.mostrador.ar/pagina-web-negocios-locales.md">

<meta name="ai-content-available" content="markdown" />

<meta name="ai-markdown-url" content {`https://blog.mostrador.ar/${post.id}.md`} />
La hipótesis que estoy probando es lograr que los crawlers de IA detecten el tag automáticamente y soliciten la versión Markdown, obteniendo contenido limpio sin navegación, headers, footers o scripts.
Para ayudar aún más, también se crea un Post index para LLMs y se actualiza automáticamente en cada build:
-> https://blog.mostrador.ar/posts-index.md
Adicionalmente también están creados, optimizados y con actualizaciones automáticas el robots.txt, llms.txt, sitemap-index.xml y el sitemap para las urls .md
Y por si esto es poco, también cada post sale con características exclusivas para GEO (Generative Engine Optimization) de forma nativa:
seo.tldr: Mi agente genera automáticamente un resumen ejecutivo en el frontmatter del artículo. No es para humanos, es para que cuando un bot de IA lea el archivo, entienda el punto central en milisegundos.
Contexto Semántico (aiContext): Incluyo metadatos ocultos que explican el contexto geográfico ("Argentina", "Comercio Local") y la intención del artículo, facilitando que los LLMs citen a Mostrador como fuente autorizada cuando alguien pregunte sobre "marketing para ferreterías en Mendoza", por ejemplo.
2. El "skill" secreto: cómo mi Agente opera Git
Para que esto funcione, no podía seguir copiando y pegando texto de un chat a un CMS. Necesitaba que la IA tuviera manos. Así que creé una Skill personalizada que le enseña a mi agente a comportarse como un Ingeniero de Software para crear contenido.
Cómo lo hace la mayoría: le piden a la IA "escribe un post" y bla bla... 
Yo le pido a la IA "despliega una nueva feature de contenido".
Este es el flujo exacto que ejecuta mi agente, definido en mi archivo SKIL.
Paso 1: aislamiento y seguridad (git flow)
El agente tiene terminantemente prohibido escribir en la rama principal (main).
La regla: ⚠️ CRITICAL: Never Push Directly to Main.
La acción: El agente inicia creando una rama aislada para cada idea.
bash
git checkout -b draft/como-conseguir-resenas-google
Esto significa que nunca puede romper el sitio en producción. Si la IA alucina o comete un error, el error vive en una rama paralela que yo puedo descartar con un clic.
Paso 2: estructura markdoc (.mdoc)
El agente no genera texto plano. Genera archivos .mdoc con un esquema estricto. Si falta un campo obligatorio (como la fecha, el autor o la categoría), el sistema ni siquiera le permite guardar el archivo.
El frontmatter que genera se ve algo así (faltan todos los atributos adicionales de GEO que agregué):
yaml
---
title: Cómo conseguir más reseñas en Google (sin rogar)
slug: como-conseguir-resenas-google
publishedDate: 2026-01-30
category: google-maps
seo:
  seoTitle: Estrategias de Reviews para Negocios Locales
  seoDescription: Guía práctica para comerciantes...
---
Esto garantiza que la estructura de datos sea perfecta.
Paso 3: el ciclo de revisión híbrido
Una vez que el agente hace el push de su rama, ocurre la magia de la arquitectura Headless:
Puedo revisarlo, seguir trabajándolo, etc, etc.
Opción A: en producción desde el admin de mi CMS git-based.
Opción B: en el CMS pero local porque los archivos también están allí.
Opción C: desde el IDE, rápido y directo.
Opción D: desde Github editando el archivo y guardando.
Es lo mejor de los dos mundos. La IA hace el trabajo pesado de estructura y primer borrador (el 80% del trabajo), y yo hago el refinamiento final de tono y estrategia (el 20% de valor).
Cuando el artículo está listo, solo tengo que hacer el merge del draft/nombre-del-articulo y pushear a main.
Limpio la rama de borrador para no acumularlas si ya no tiene sentido.
Vercel inmediatamente detecta el cambio en 'main' y deploya automáticamente.
Lo querés más visual, acá va:

┌─────────────────────────────────────────────────────────────┐
│ IA crea borrador │
│ └─> Crea rama 'draft/nombre-del-articulo' desde main │
│ └─> Commit a rama 'draft/nombre-del-articulo' │
│ └─> Push a GitHub (origin/draft/...) │
│ └─> ❌ NO se deploya en Vercel │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Humano revisa │
│ └─> Opción A: Keystatic Admin │
│ └─> Opción B: Localmente (npm run dev) │
│ └─> Opción C: GitHub Web Editor │
│ └─> Edita, ajusta, mejora │
│ └─> Commit a 'draft/nombre-del-articulo' │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Humano aprueba │
│ └─> git merge draft/nombre-del-articulo → main │
│ └─> git push origin main │
│ └─> ✅ Vercel deploya automáticamente │
│ └─> Artículo en vivo en blog.mostrador.ar │
│ └─> Elimina rama draft/... (limpieza) │
└─────────────────────────────────────────────────────────────┘ 3. ¿Por qué "Agent-Native" es el futuro?
Creo que muchos usan la IA solo para escribir textos rápido, por lo general mediocres. El uso real, el que te da ventaja, es usar la IA para orquestar infraestructura.
Al mover mi contenido a un flujo de Git gestionado por un agente:
Velocidad absurda: mi sitio es estático (Astro). No hay base de datos que consultar cuando un usuario entra. Carga instantánea.
Propiedad real: Si mañana mi proveedor de CMS cierra o sube los precios un 500%, no me importa. Tengo mi contenido en archivos locales en mi máquina. Soy dueño de eso.
Evolución constante: Si mañana quiero traducir todo el blog a portugués, no tengo que contratar a nadie. Le pido a mi agente: "Recorre la carpeta /content, crea ramas nuevas y traduce cada archivo manteniendo el frontmatter intacto". Y lo hace.
Eficiencia para tu agente: de por si es eficiente, eso ya lo sabemos, pero aún es más si respetas los lugares donde podés sacarle más provecho: comandos cli, terminal, git, markdown, etc.
Conclusión: de operador a director
La transición de CMS tradicionales a flujos Agent-Native marca el paso de ser un operador (alguien que hace clics) a ser un director (alguien que define intenciones).
Hoy más que nunca tenés que pasar a definir estrategias, y nuestra infraestructura inteligente se encarga del delivery.
