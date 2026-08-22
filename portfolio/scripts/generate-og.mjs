// Renders public/og-image.svg -> public/og-image.png (1200x630).
// Fonts: the repo's self-hosted woff2 files are decompressed to TTF in a
// temp dir so resvg can embed them; no system fonts are used.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import wawoff2 from 'wawoff2';
import { Resvg } from '@resvg/resvg-js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fontsDir = path.join(tmpdir(), 'warquah-og-fonts');

async function woff2ToTtf(name) {
  const woff2 = readFileSync(path.join(root, 'public', 'fonts', name));
  const ttf = Buffer.from(await wawoff2.decompress(woff2));
  const out = path.join(fontsDir, name.replace(/\.woff2$/, '.ttf'));
  writeFileSync(out, ttf);
  return out;
}

mkdirSync(fontsDir, { recursive: true });
try {
  const fontFiles = await Promise.all([
    woff2ToTtf('fraunces-variable.woff2'),
    woff2ToTtf('plex-mono-regular.woff2'),
    woff2ToTtf('plex-mono-medium.woff2'),
  ]);

  const svg = readFileSync(path.join(root, 'public', 'og-image.svg'), 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'original' },
    font: {
      loadSystemFonts: false,
      fontFiles,
      defaultFontFamily: 'Fraunces',
    },
  });

  const png = resvg.render().asPng();
  writeFileSync(path.join(root, 'public', 'og-image.png'), png);
  console.log(`og-image.png written (${png.length} bytes)`);
} finally {
  rmSync(fontsDir, { recursive: true, force: true });
}
