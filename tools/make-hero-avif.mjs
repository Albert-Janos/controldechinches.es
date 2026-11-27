// One-off: derive AVIF variants of the EXISTING hero images (same pictures, new format; originals untouched).
import sharp from 'sharp';
for (const [src, dst, q] of [['../assets/hero-0010.webp', '../assets/hero-0010.avif', 52], ['../assets/hero-0010-mobile.webp', '../assets/hero-0010-mobile.avif', 52]]) {
  const info = await sharp(src).avif({ quality: q, effort: 6 }).toFile(dst);
  console.log(dst, info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
}
