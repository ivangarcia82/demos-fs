// Genera src/data/demos.json: manifest de todas las demos existentes con su
// metadata real (nombre, categoría, rating) agrupable por giro, para la galería
// del index. Es self-contained (se commitea) para que la portada funcione en
// Vercel aunque la carpeta ../demos (dossiers) no se suba.
//
// Correr desde demos-astro/:  node scripts/gen-gallery.mjs   (o npm run gen-gallery)
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();                 // demos-astro/
const PAGES = join(ROOT, 'src', 'pages');
const DOSSIERS = join(ROOT, '..', 'demos'); // hermano: los data.json fuente de verdad
const OUT_DIR = join(ROOT, 'src', 'data');
const OUT = join(OUT_DIR, 'demos.json');

// Giros: clave, etiqueta, emoji y orden de aparición en la galería.
const GIROS = [
  { key: 'comida',     label: 'Comida y restaurantes',   emoji: '🍽️' },
  { key: 'belleza',    label: 'Barbería, belleza y spa',  emoji: '💈' },
  { key: 'gimnasios',  label: 'Gimnasios',                emoji: '🏋️' },
  { key: 'vet',        label: 'Veterinarias y mascotas',  emoji: '🐾' },
  { key: 'dental',     label: 'Dentistas',                emoji: '🦷' },
  { key: 'taller',     label: 'Talleres y automotriz',    emoji: '🔧' },
  { key: 'turismo',    label: 'Turismo y experiencias',   emoji: '🧭' },
  { key: 'contable',   label: 'Contable y fiscal',        emoji: '📊' },
  { key: 'otros',      label: 'Otros',                    emoji: '✨' },
];

function giroDe(cat = '') {
  const c = cat.toLowerCase();
  const has = (...ws) => ws.some((w) => c.includes(w));
  if (has('barber', 'barbar', 'peluqu', 'estética', 'estetica', 'salón', 'salon', 'belleza', 'spa', 'hair', 'beauty', 'cejas', 'pestañas', 'uñas', 'manicura')) return 'belleza';
  if (has('dental', 'dentista', 'odont', 'cirujano')) return 'dental';
  if (has('veterinar', 'mascota', 'animal', 'pet', 'acuario')) return 'vet';
  if (has('gimnasio', 'gym', 'fitness', 'deportivo', 'training')) return 'gimnasios';
  if (has('taller', 'mecán', 'automotri', 'autoclima')) return 'taller';
  if (has('turístic', 'turística', 'tour', 'atracción', 'malecón', 'viaje', 'experiencia')) return 'turismo';
  if (has('contab', 'fiscal', 'contador', 'asesor', 'despacho', 'impuesto')) return 'contable';
  if (has('restaurant', 'marisq', 'taquer', 'loncher', 'café', 'cafe', 'cocina', 'comida', 'antojos', 'botaner', 'bar', 'pizz', 'birria', 'desayun')) return 'comida';
  return 'otros';
}

const slugs = readdirSync(PAGES, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const demos = slugs.map((slug) => {
  let meta = {};
  try { meta = JSON.parse(readFileSync(join(DOSSIERS, slug, 'data.json'), 'utf-8')); } catch { /* sin dossier */ }
  return {
    slug,
    nombre: meta.nombre || slug,
    categoria: meta.categoria || '',
    rating: meta.rating ?? null,
    total: meta.total_resenas ?? null,
    giro: giroDe(meta.categoria || ''),
  };
});

const grupos = GIROS
  .map((g) => ({ ...g, items: demos.filter((d) => d.giro === g.key).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')) }))
  .filter((g) => g.items.length > 0);

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, JSON.stringify({ total: demos.length, grupos }, null, 2) + '\n');
console.log(`gen-gallery: ${demos.length} demos en ${grupos.length} giros → src/data/demos.json`);
