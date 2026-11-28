// Minimal client-side / node PDF writer (A4, Helvetica base-14 fonts, WinAnsi text, optional JPEG logo). No dependencies, no network, no storage.
// Used (1) by tools/build-pdfs.mjs to generate the static downloadable PDFs and (2) in the browser to create the filled detection report
// ON THE VISITOR'S DEVICE - nothing is uploaded anywhere.
export const A4 = { w: 595.28, h: 841.89 };
const W_REG = { ' ': 278, '!': 278, '"': 355, '#': 556, $: 556, '%': 889, '&': 667, "'": 191, '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278, ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556, '@': 1015, A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611, '[': 278, '\\': 278, ']': 278, '^': 469, _: 556, '`': 333, a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500, '{': 334, '|': 260, '}': 334, '~': 584, '¿': 611, '¡': 333, '€': 556, '–': 556, '—': 1000, '«': 556, '»': 556, '•': 350, '’': 222, '‘': 222, '“': 333, '”': 333, 'º': 365, 'ª': 365, '·': 278, '°': 400 };
const W_BOLD = { ' ': 278, '!': 333, '"': 474, '#': 556, $: 556, '%': 889, '&': 722, "'": 238, '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278, ':': 333, ';': 333, '<': 584, '=': 584, '>': 584, '?': 611, '@': 975, A: 722, B: 722, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 556, K: 722, L: 611, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611, '[': 333, '\\': 278, ']': 333, '^': 584, _: 556, '`': 333, a: 556, b: 611, c: 556, d: 611, e: 556, f: 333, g: 611, h: 611, i: 278, j: 278, k: 556, l: 278, m: 889, n: 611, o: 611, p: 611, q: 611, r: 389, s: 556, t: 333, u: 611, v: 556, w: 778, x: 556, y: 556, z: 500, '{': 389, '|': 280, '}': 389, '~': 584, '¿': 611, '¡': 333, '€': 556, '–': 556, '—': 1000, '«': 556, '»': 556, '•': 350, '’': 278, '‘': 278, '“': 500, '”': 500, 'º': 365, 'ª': 365, '·': 278, '°': 400 };
const DIGIT = 556;
const WIN = { '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87, 'ˆ': 0x88, '‰': 0x89, 'Š': 0x8a, '‹': 0x8b, 'Œ': 0x8c, 'Ž': 0x8e, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97, '˜': 0x98, '™': 0x99, 'š': 0x9a, '›': 0x9b, 'œ': 0x9c, 'ž': 0x9e, 'Ÿ': 0x9f };
const FALLBACK = { '≈': '~', '→': '->', '←': '<-', '✓': 'v', '✔': 'v', '☐': '[ ]', ' ': ' ', ' ': ' ', ' ': ' ', '​': '', '−': '-', '‑': '-', '≥': '>=', '≤': '<=', '×': 'x' };
export function winansi(s) { // -> string whose char codes are the WinAnsi byte values
  let out = '';
  for (const ch0 of String(s)) {
    const ch = FALLBACK[ch0] ?? ch0;
    for (const c of ch) { const cp = c.codePointAt(0); out += cp < 0x80 || (cp >= 0xa0 && cp <= 0xff) ? c : WIN[c] ? String.fromCharCode(WIN[c]) : cp === 0x0a || cp === 0x09 ? ' ' : '?'; }
  }
  return out;
}
const baseChar = c => c.normalize('NFD')[0];
export function textWidth(s, size, bold) {
  const T = bold ? W_BOLD : W_REG; let w = 0;
  for (const c of String(s)) w += /[0-9]/.test(c) ? DIGIT : T[c] ?? T[baseChar(c)] ?? 556;
  return (w * size) / 1000;
}
export function wrapText(s, maxW, size, bold) {
  const lines = [];
  for (const para of String(s).split('\n')) {
    let cur = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = cur ? cur + ' ' + word : word;
      if (cur && textWidth(next, size, bold) > maxW) { lines.push(cur); cur = word; } else cur = next;
    }
    lines.push(cur);
  }
  return lines;
}
const f = n => (Math.round(n * 100) / 100).toString();
const esc = s => winansi(s).replace(/[\\()]/g, m => '\\' + m).replace(/[\u0080-ÿ]/g, c => '\\' + c.charCodeAt(0).toString(8).padStart(3, '0'));
const col = (c = [0, 0, 0]) => c.map(v => f(v)).join(' ');
export function jpegSize(b) { // read width/height from a baseline/progressive JPEG
  let i = 2;
  while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m >= 0xc0 && m <= 0xc3) return { h: (b[i + 5] << 8) | b[i + 6], w: (b[i + 7] << 8) | b[i + 8] }; i += 2 + ((b[i + 2] << 8) | b[i + 3]); }
  throw new Error('not a JPEG');
}

export class Pdf {
  constructor({ title = '', author = '', subject = '', keywords = '', lang = 'es', logo = null, date = new Date() } = {}) {
    Object.assign(this, { title, author, subject, keywords, lang, logo, date, pages: [] });
    if (logo) this.logoDim = jpegSize(logo);
    this.newPage();
  }
  newPage() { this.cur = { ops: [], usesLogo: false }; this.pages.push(this.cur); return this.cur; }
  y(y) { return f(A4.h - y); } // y from the top edge
  text(str, x, y, { size = 10, bold = false, color = [0.1, 0.12, 0.15], align = 'left', width = 0 } = {}) {
    let px = x; const w = textWidth(str, size, bold);
    if (align === 'right') px = x - w; else if (align === 'center') px = x - w / 2;
    this.cur.ops.push(`BT /${bold ? 'F2' : 'F1'} ${f(size)} Tf ${col(color)} rg ${f(px)} ${this.y(y)} Td (${esc(str)}) Tj ET`);
    return w;
  }
  rect(x, y, w, h, { fill = null, stroke = null, lw = 0.8 } = {}) {
    const op = fill && stroke ? 'B' : fill ? 'f' : 'S';
    this.cur.ops.push(`q ${fill ? col(fill) + ' rg ' : ''}${stroke ? col(stroke) + ' RG ' : ''}${f(lw)} w ${f(x)} ${f(A4.h - y - h)} ${f(w)} ${f(h)} re ${op} Q`);
  }
  line(x1, y1, x2, y2, { lw = 0.6, color = [0.35, 0.4, 0.45], dash = null } = {}) {
    this.cur.ops.push(`q ${col(color)} RG ${f(lw)} w ${dash ? `[${dash}] 0 d ` : ''}${f(x1)} ${this.y(y1)} m ${f(x2)} ${this.y(y2)} l S Q`);
  }
  checkbox(x, y, size = 9, checked = false) { // (x, y) = top-left of the box
    this.rect(x, y, size, size, { stroke: [0.15, 0.2, 0.25], lw: 0.9 });
    if (checked) this.cur.ops.push(`q 0.1 0.2 0.1 RG 1.6 w 1 J 1 j ${f(x + size * 0.2)} ${this.y(y + size * 0.55)} m ${f(x + size * 0.42)} ${this.y(y + size * 0.8)} l ${f(x + size * 0.85)} ${this.y(y + size * 0.2)} l S Q`);
  }
  image(x, y, w) {
    if (!this.logo) return 0; const h = (w * this.logoDim.h) / this.logoDim.w; this.cur.usesLogo = true;
    this.cur.ops.push(`q ${f(w)} 0 0 ${f(h)} ${f(x)} ${f(A4.h - y - h)} cm /Im1 Do Q`); return h;
  }
  bytes() {
    const enc = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return b; };
    const chunks = [], offsets = []; let size = 0;
    const push = b => { chunks.push(b); size += b.length; };
    const objs = [], add = body => { objs.push(body); return objs.length; };
    const catalog = add(null), pagesObj = add(null), f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'), f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    let imgObj = 0;
    if (this.logo) imgObj = add({ stream: this.logo, dict: `<< /Type /XObject /Subtype /Image /Width ${this.logoDim.w} /Height ${this.logoDim.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode` });
    const kids = [];
    for (const p of this.pages) {
      const content = add({ stream: enc(p.ops.join('\n')), dict: '<<' });
      const res = `/Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >>${imgObj ? ` /XObject << /Im1 ${imgObj} 0 R >>` : ''} >>`;
      kids.push(add(`<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${f(A4.w)} ${f(A4.h)}] ${res} /Contents ${content} 0 R >>`));
    }
    const d = this.date, pad = n => String(n).padStart(2, '0');
    const dateStr = `D:${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    const info = add(`<< /Title (${esc(this.title)}) /Author (${esc(this.author)}) /Subject (${esc(this.subject)}) /Keywords (${esc(this.keywords)}) /Creator (controldechinches.es) /Producer (controldechinches.es pdf.js) /CreationDate (${dateStr}) >>`);
    objs[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R /Lang (${this.lang}) /ViewerPreferences << /DisplayDocTitle true >> >>`;
    objs[pagesObj - 1] = `<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
    push(enc('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'));
    objs.forEach((o, i) => {
      offsets.push(size); push(enc(`${i + 1} 0 obj\n`));
      if (typeof o === 'string') push(enc(o + '\n'));
      else { push(enc(`${o.dict} /Length ${o.stream.length} >>\nstream\n`)); push(o.stream); push(enc('\nendstream\n')); }
      push(enc('endobj\n'));
    });
    const xref = size;
    push(enc(`xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
    const out = new Uint8Array(size); let pos = 0; for (const c of chunks) { out.set(c, pos); pos += c.length; }
    return out;
  }
}

// ---------------- simple flowing layout ----------------
export class Layout {
  constructor(pdf, { margin = 50, top = 100, bottom = 62, onNewPage } = {}) { Object.assign(this, { pdf, m: margin, top, bottom, onNewPage }); this.y = top; this.W = A4.w - 2 * margin; }
  ensure(h) { if (this.y + h > A4.h - this.bottom) { this.pdf.newPage(); this.y = this.top; this.onNewPage?.(this.pdf); } }
  gap(h = 8) { this.y += h; }
  h1(s) { const lines = wrapText(s, this.W, 20, true); this.ensure(lines.length * 25 + 8); for (const l of lines) { this.pdf.text(l, this.m, this.y + 18, { size: 20, bold: true, color: [0.07, 0.1, 0.14] }); this.y += 25; } this.y += 4; }
  h2(s) { this.ensure(34); this.y += 6; this.pdf.rect(this.m, this.y + 2, 4, 15, { fill: [0.96, 0.78, 0] }); this.pdf.text(s, this.m + 11, this.y + 14, { size: 13, bold: true, color: [0.07, 0.1, 0.14] }); this.y += 24; }
  p(s, { size = 10, bold = false, color, indent = 0, gapAfter = 5 } = {}) { const lines = wrapText(s, this.W - indent, size, bold); const lh = size * 1.38; this.ensure(lines.length * lh); for (const l of lines) { this.y += lh; this.pdf.text(l, this.m + indent, this.y - size * 0.25, { size, bold, color }); } this.y += gapAfter; }
  bullets(items, { size = 10 } = {}) { for (const it of items) { const lines = wrapText(it, this.W - 16, size, false), lh = size * 1.38; this.ensure(lines.length * lh + 3); this.pdf.text('•', this.m + 3, this.y + lh - size * 0.25, { size }); for (const l of lines) { this.y += lh; this.pdf.text(l, this.m + 16, this.y - size * 0.25, { size }); } this.y += 3; } this.y += 2; }
  checklist(items, { size = 10, checked = () => false } = {}) { items.forEach((it, i) => { const lines = wrapText(it, this.W - 24, size, false), lh = size * 1.38, h = Math.max(lines.length * lh, 13) + 5; this.ensure(h); this.pdf.checkbox(this.m + 1, this.y + 2, 10, checked(i)); lines.forEach((l, k) => this.pdf.text(l, this.m + 22, this.y + (k + 1) * lh - size * 0.25 + 1, { size })); this.y += h; }); this.y += 2; }
  note(s) { const lines = wrapText(s, this.W - 20, 9, false), h = lines.length * 12.4 + 14; this.ensure(h + 4); this.pdf.rect(this.m, this.y, this.W, h, { fill: [0.97, 0.96, 0.92], stroke: [0.85, 0.82, 0.7], lw: 0.6 }); lines.forEach((l, k) => this.pdf.text(l, this.m + 10, this.y + 14 + k * 12.4, { size: 9, color: [0.25, 0.28, 0.3] })); this.y += h + 8; }
  field(label, value = '', { w = this.W, x = this.m } = {}) { // label above a ruled line, optional filled value
    this.pdf.text(label, x, this.y + 8, { size: 8.5, bold: true, color: [0.3, 0.34, 0.38] });
    if (value) this.pdf.text(String(value).slice(0, 110), x + 2, this.y + 23, { size: 10.5 });
    this.pdf.line(x, this.y + 27, x + w, this.y + 27, { lw: 0.7 });
  }
  table(head, rows, widths, { rowH = 22, size = 9 } = {}) {
    const total = widths.reduce((a, b) => a + b, 0), k = this.W / total, w = widths.map(x => x * k);
    const drawRow = (cells, h, header) => {
      this.ensure(h); let x = this.m;
      if (header) this.pdf.rect(this.m, this.y, this.W, h, { fill: [0.93, 0.93, 0.9] });
      cells.forEach((c, i) => { this.pdf.rect(x, this.y, w[i], h, { stroke: [0.55, 0.58, 0.6], lw: 0.5 }); wrapText(c, w[i] - 8, size, header).forEach((l, n) => this.pdf.text(l, x + 4, this.y + 12 + n * size * 1.3, { size, bold: header })); x += w[i]; });
      this.y += h;
    };
    drawRow(head, 22, true);
    for (const r of rows) drawRow(r, Math.max(rowH, ...r.map((c, i) => wrapText(c, w[i] - 8, size, false).length * size * 1.3 + 8)), false);
    this.y += 6;
  }
}
