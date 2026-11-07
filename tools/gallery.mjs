// Dev helper: writes the README gallery and previews/README.md from previews/*.jpg and the catalog.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cat = fs
  .readFileSync(path.join(root, 'skills/adbertiser-istayle/catalog/STYLES.md'), 'utf8')
  .split('\n')
  .filter((l) => /^\| [A-Z]\d+ \|/.test(l))
  .map((l) => l.split('|').slice(1, -1).map((s) => s.trim()));
const name = Object.fromEntries(cat.map((c) => [c[0], c[1]]));
const have = fs.readdirSync(path.join(root, 'previews')).filter((f) => /^[A-Z]\d+\.jpg$/.test(f)).map((f) => f.slice(0, -4));
const order = (a, b) => a[0].localeCompare(b[0]) || Number(a.slice(1)) - Number(b.slice(1));

const cell = (id, w) => `<td align="center"><img src="previews/${id}.jpg" width="${w}" alt="${id}"><br><sub><b>${id}</b> ${name[id] ?? ''}</sub></td>`;
const table = (ids, cols, w, prefix = '') =>
  `<table>\n${Array.from({length: Math.ceil(ids.length / cols)}, (_, r) => `<tr>${ids.slice(r * cols, r * cols + cols).map((id) => cell(id, w).replace('previews/', prefix)).join('')}</tr>`).join('\n')}\n</table>`;

const PICK = ['J1', 'B1', 'C1', 'C2', 'C3', 'C4', 'B3', 'B4', 'B10', 'B11', 'F6', 'G6', 'H9', 'G1', 'K4', 'K7'].filter((id) => have.includes(id));
const readme = path.join(root, 'README.md');
const gal = `<!-- GALLERY -->\n${table(PICK, 4, 180)}\n\nAll ${have.length} template previews: [previews/](previews/README.md)\n<!-- /GALLERY -->`;
let md = fs.readFileSync(readme, 'utf8');
md = md.includes('<!-- /GALLERY -->') ? md.replace(/<!-- GALLERY -->[\s\S]*<!-- \/GALLERY -->/, gal) : md.replace('<!-- GALLERY -->', gal);
fs.writeFileSync(readme, md);

const all = have.sort(order);
fs.writeFileSync(path.join(root, 'previews', 'README.md'), `# Template previews\n\nStills of each template's built-in demo (no files needed). Render your own: \`node scripts/preview.mjs <ID>\`.\n\n${table(all, 5, 150, '')}\n`);
console.log(`gallery: ${PICK.length} in README, ${all.length} in previews/README.md`);
