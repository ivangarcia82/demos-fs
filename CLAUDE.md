# CLAUDE.md — Fábrica de demos (Astro · proyecto demos-astro → demos.ivang.mx)

Este proyecto es un sitio Astro estático desplegado en Vercel bajo
`demos.ivang.mx`. Cada negocio prospectado vive en su propia ruta:
`demos.ivang.mx/<slug>`. Cada página debe tener un diseño y una
personalidad ÚNICOS, derivados del negocio real — nunca una plantilla
con colores cambiados.

## Datos de entrada

Cada negocio ya tiene un dossier completo generado por `enriquecer_leads.py`:

- `demos/<slug>/data.json` — nombre, categoría, descripción editorial de
  Google, dirección, teléfono, whatsapp, rating, total de reseñas, horarios
  reales por día, atributos verificados (delivery, tarjetas, estacionamiento,
  etc.), hasta 5 reseñas reales con autor y texto, y la lista de fotos.
- `demos/<slug>/img/` — sus fotos reales descargadas de Google Maps.

El nombre de la carpeta en `demos/` ES el slug del negocio.

SIEMPRE lee el data.json completo antes de diseñar. Las reseñas son tu
brief de diseño: ahí está la voz de sus clientes, lo que aman del negocio
y el material que hace que la página se sienta suya.

## Arquitectura del proyecto

```
batches/
  batch-1.json                ← qué slugs se generan en este lote (ver "Sistema de batches")
src/
  pages/<slug>.astro          ← una página por negocio, diseño autocontenido
  pages/index.astro           ← portada mínima de demos.ivang.mx (mi branding)
  components/DemoBanner.astro ← banner compartido "Demo creada por ivang.mx"
  components/BaseHead.astro   ← meta tags + Open Graph compartidos
  assets/<slug>/              ← fotos del negocio (copiadas desde demos/<slug>/img/)
demos/<slug>/data.json        ← dossiers (fuente de verdad, no se sirven)
design-log.md                 ← bitácora de diseño (ver "Regla de unicidad")
```

- Usa `astro:assets` (componente `<Image />`) para optimizar las fotos.
- Cada `.astro` de negocio importa su `data.json` directamente.
- CERO frameworks CSS globales (no Tailwind, no Bootstrap). Cada página
  lleva sus propios estilos scoped: es la única forma de garantizar que
  cada demo tenga identidad propia. Lo único compartido: DemoBanner y
  BaseHead.

## Sistema de batches (qué páginas se generan ahora)

Los lotes de generación se controlan con archivos en `batches/`. Cada
archivo `batch-N.json` lista los slugs de ESE lote:

```json
{
  "batch": "Batch 1",
  "slugs": ["clinica-dental-altabrisa", "barberia-montejo", "..."]
}
```

Reglas del sistema de batches:

- Cuando yo diga **"genera el batch 1"** (o el número que sea), lee
  `batches/batch-1.json` y genera ÚNICAMENTE los slugs listados ahí. No
  toques ningún otro dossier de `demos/`, aunque exista.
- Si un slug del batch ya tiene su `src/pages/<slug>.astro`, sáltalo (no
  lo regeneres) salvo que yo lo pida explícitamente.
- Si te pido "llena el batch 1 con los primeros N dossiers", escribe esos
  N slugs (nombres de carpeta de `demos/`) dentro de `batches/batch-1.json`.
- Al terminar un batch, reporta qué slugs se generaron y cuáles se saltaron.

Esto me permite ir por lotes controlados (revisar 30, publicar, seguir con
los siguientes) sin generar de más.

## Proceso obligatorio por cada demo

1. **Lee el dossier completo** (`data.json` + revisa las fotos de `img/`).
2. **Invoca la skill `frontend-design`** (frontend-design@claude-plugins-official)
   ANTES de diseñar. Es obligatorio en cada demo, no solo la primera.
3. **Redacta el plan de diseño** siguiendo la skill: paleta de 4-6 hex con
   nombre, pareja tipográfica (display con carácter + cuerpo legible, de
   Google Fonts), concepto de layout, y el ELEMENTO FIRMA — la única cosa
   por la que esta página será recordada. Todo debe derivarse del mundo
   real del negocio:
   - Las fotos dictan la paleta (extrae los colores dominantes del local,
     sus platillos, su fachada).
   - Las reseñas dictan la voz y los énfasis (si todos hablan de "la
     atención de la Dra.", el diseño gira alrededor de eso).
   - La categoría dicta el registro (taquería ≠ notaría ≠ barbería).
4. **Contrasta contra design-log.md** (regla de unicidad, abajo). Si tu
   plan se parece a una demo anterior, revísalo antes de escribir código.
5. **Construye** `src/pages/<slug>.astro` siguiendo el plan exactamente.
6. **Registra** el resultado en design-log.md.

## Regla de unicidad (design-log.md)

Después de cada demo, agrega una línea a `design-log.md`:

```
| slug | paleta (3 hex clave) | display font | body font | elemento firma |
```

Antes de diseñar una demo nueva, LEE la bitácora completa. Prohibido
repetir: la misma pareja tipográfica, una paleta con los mismos dominantes,
o el mismo tipo de elemento firma que cualquier demo anterior. Dos
taquerías del mismo lote deben verse tan distintas entre sí como una
taquería y un despacho contable. Evita también los tres clichés que la
skill señala como "look de IA" (crema + serif + terracota; fondo negro +
acento ácido; broadsheet de hairlines).

## Contenido de cada página — ve más allá de lo básico

Apunta a una página RICA que impresione: **6 a 9 secciones**, no las tres
mínimas. Pero una regla por encima de todo:

> **Más impacto = minar el dossier más a fondo, NUNCA inventar.**
> Cada sección extra debe nacer de datos reales (fotos, reseñas, atributos,
> horarios). Si el dossier no da material para una sección, se omite. Jamás
> rellenes con datos falsos, reseñas inventadas, precios, años de
> experiencia, premios o certificaciones que no estén en el dossier.

El ORDEN y la FORMA son libres — el hero es una tesis y debe abrir con lo
más característico de ESE negocio (una foto potente, una frase de reseña
real, su rating monumental). De ahí, arma la página combinando estas
secciones según lo que el dossier permita:

**Núcleo (siempre presente):**
- **Hero** con contacto por WhatsApp visible sin scroll (link del dossier).
- **Quiénes son**: parte de `descripcion_google` si existe; si no, texto
  creíble según categoría. Mina las reseñas para darle voz. Sin inventar.
- **Prueba social**: rating y total reales ("⭐ 4.8 · 132 reseñas en
  Google") + reseñas del dossier citadas TAL CUAL con autor y antigüedad.
  Link "Leer más en Google" (maps_url).
- **Ubicación**: dirección real + mapa embebido (iframe de Google Maps).
- **DemoBanner** (compartido).
- **CTA final** de WhatsApp fuerte, y botón flotante de WhatsApp en toda la página.

**Secciones de impacto (agrega las que el dossier soporte):**
- **Galería visual**: mosaico o carrusel con SUS fotos reales de `img/`.
  Es el mayor golpe de impacto — si hay 4+ fotos, casi siempre inclúyela.
- **Reseñas destacadas ampliadas**: no 2, sino un carrusel/muro con todas
  las reseñas buenas del dossier, cada una con autor y antigüedad reales.
- **Por qué elegirnos / diferenciadores**: 3-4 puntos, cada uno derivado
  de un atributo verificado o de algo que las reseñas repiten (p. ej. si
  varias mencionan "rápidos y limpios", eso es un diferenciador real).
- **Franja de atributos**: tira de íconos con los `atributos` verificados
  (servicio a domicilio, acepta tarjeta, estacionamiento, reservaciones,
  acceso para silla de ruedas, etc.). Solo los que el dossier confirme.
- **Especialidad según el giro** (derivada de reseñas/atributos, sin precios):
  · Restaurante/cafetería → "Lo más pedido": platillos que las reseñas
    nombran ("las carnitas", "el pan de elote").
  · Clínica/consultorio → "Servicios / tratamientos" que el dossier o las
    reseñas mencionen.
  · Barbería/estética/spa → "Servicios" según reseñas/atributos.
  · Taller/servicios → "Qué hacemos" según reseñas/atributos.
- **Horarios**: tabla con los horarios reales del dossier. Si no hay, omite.
- **CTA intermedio**: una banda de WhatsApp a media página para captar al
  que ya se convenció sin llegar al final.
- **FAQ corto**: 3-4 preguntas respondidas SOLO con datos del dossier
  (¿aceptan tarjeta? ¿hacen citas? ¿tienen estacionamiento?). Si el dato
  no está confirmado, no inventes la respuesta: omite esa pregunta.

Todo el texto en español de México, escrito desde el lado del cliente
(claro, específico, sin jerga de sistemas ni marketing hueco).

## Piso de calidad (no negociable)

- Mobile-first real: el dueño la abrirá desde WhatsApp en su celular.
- Aunque tenga 9 secciones, debe cargar rápido en 4G: imágenes optimizadas
  vía astro:assets, máximo 2 familias tipográficas, sin JS innecesario.
- Open Graph completo por página (título, descripción y og:image con su
  mejor foto). La preview del link en WhatsApp ES la primera impresión.
- Foco visible en teclado, `prefers-reduced-motion` respetado, contraste AA.
- La animación (si la hay) debe ser un momento orquestado que sirva al
  negocio, no efectos regados.

## Flujo del batch

Cuando yo diga **"genera el batch N"**:

1. Lee `batches/batch-N.json` y toma solo esos slugs.
2. Para cada slug, ejecuta el proceso obligatorio COMPLETO — incluida la
   skill frontend-design y la bitácora en CADA uno. No optimices saltándote
   pasos. Salta los que ya tengan su `.astro`.
3. Copia las fotos de `demos/<slug>/img/` a `src/assets/<slug>/`.
4. Al final imprime la tabla: negocio | slug | https://demos.ivang.mx/<slug>
   (para copiar a la columna demo_url del CSV) e indica cuáles se saltaron.
5. Recuérdame correr `npm run build` para verificar y `vercel --prod`
   para publicar.

## Setup inicial (solo la primera vez)

Si el proyecto Astro aún no existe: `npm create astro@latest` (plantilla
mínima, TypeScript opcional), output estático, y crea DemoBanner.astro,
BaseHead.astro, la portada index.astro, la carpeta `batches/` y un
design-log.md vacío con el encabezado de la tabla.
