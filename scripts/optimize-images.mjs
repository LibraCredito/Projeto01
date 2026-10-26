// Gera versões .webp otimizadas das fotos de public/images.
// Uso: node scripts/optimize-images.mjs
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')
const MAX_WIDTH = { 'img-03.jpg': 800, 'img-04.jpg': 800, 'img-05.jpg': 800 }

for (const name of await readdir(dir)) {
  if (!/^img-\d+\.jpg$/.test(name)) continue
  const src = path.join(dir, name)
  const out = src.replace(/\.jpg$/, '.webp')
  await sharp(src)
    .rotate()
    .resize({ width: MAX_WIDTH[name] ?? 1200, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(out)
  const [a, b] = await Promise.all([stat(src), stat(out)])
  console.log(`${name}: ${Math.round(a.size / 1024)} KB -> ${Math.round(b.size / 1024)} KB`)
}
