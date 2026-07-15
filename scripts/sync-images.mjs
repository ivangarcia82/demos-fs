// Sincroniza las fotos de los dossiers (demos/<slug>/img) hacia public/<slug>/img.
// Uso: npm run sync-img
import { cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DOSSIERS = new URL('../../demos/', import.meta.url).pathname;
const PUBLIC = new URL('../public/', import.meta.url).pathname;

let synced = 0;
for (const slug of readdirSync(DOSSIERS)) {
  const imgDir = join(DOSSIERS, slug, 'img');
  if (!existsSync(imgDir) || !statSync(imgDir).isDirectory()) continue;
  cpSync(imgDir, join(PUBLIC, slug, 'img'), { recursive: true });
  synced++;
}
console.log(`Sincronizadas las fotos de ${synced} negocios hacia public/`);
