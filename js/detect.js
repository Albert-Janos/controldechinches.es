// Online detection report (PG-072A). Runs entirely in the browser: no server call, no storage, no analytics payload.
// - builds a readable WhatsApp text from EVERY filled field and EVERY ticked sign (the visitor sends it himself/herself in WhatsApp),
// - creates the filled PDF on the device (js/pdf-docs.js) for download or, where the browser supports it, the native share sheet (Web Share API with files),
// - prints the form (one A4 page, see @media print in assets/seo.css).
import { buildDocument } from './pdf-docs.js';
import { track, bindDeclarativeTracking } from './track.js?v=1';
import { prices } from './prices.js?v=2';

const KEYS = ['datetime', 'property', 'unit', 'reporter', 'town', 'phone'];
const pad = n => String(n).padStart(2, '0');
const root = document.querySelector('[data-detect]');
bindDeclarativeTracking();
if (root) init(root);

function init(root) {
  const lang = root.dataset.lang === 'en' ? 'en' : 'es', S = JSON.parse(root.dataset.strings), form = root.querySelector('form'), err = root.querySelector('[data-error]');
  const dt = form.elements.datetime;
  const nowLocal = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  dt.value = nowLocal();
  form.addEventListener('reset', () => setTimeout(() => { dt.value = nowLocal(); showError(''); }, 0));
  const showError = m => { err.textContent = m; err.hidden = !m; };
  const fmtDate = raw => { const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(raw || ''); return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : ''; };

  function read() {
    const d = {};
    for (const k of KEYS) d[k] = (form.elements[k].value || '').trim();
    d.checks = [...form.querySelectorAll('input[name="sign"]')].map(i => i.checked);
    return d;
  }
  function validate(d) {
    if (d.datetime && (!fmtDate(d.datetime) || Number.isNaN(new Date(d.datetime).getTime()))) return S.dateBad;
    if (d.phone) { const digits = d.phone.replace(/\D/g, ''); if (!/^[+()\d][\d\s\-().]*$/.test(d.phone) || digits.length < 6 || digits.length > 16) return S.phoneBad; }
    const hasContent = KEYS.some(k => k !== 'datetime' && d[k]) || d.checks.some(Boolean);
    return hasContent ? '' : S.empty;
  }
  const printable = d => ({ ...d, datetime: fmtDate(d.datetime) });
  function message(d) {
    const p = printable(d), out = [`${S.title} – Control de Chinches`, ''];
    KEYS.forEach((k, i) => { if (p[k]) out.push(`${S.labels[i]}: ${p[k]}`); });
    const signs = S.checks.filter((_, i) => d.checks[i]);
    if (signs.length) out.push('', `${S.signs}:`, ...signs.map(s => `- ${s}`));
    out.push('', S.ask);
    return out.join('\n');
  }
  let logoPromise = null;
  const logo = () => (logoPromise ||= fetch('/assets/pdf-logo.jpg').then(r => (r.ok ? r.arrayBuffer() : null)).then(b => (b ? new Uint8Array(b) : null)).catch(() => null));
  async function pdfBytes(d) { return buildDocument('detection', lang, { logo: await logo(), data: printable(d) }); }
  const pdfFile = bytes => new File([bytes], S.filename, { type: 'application/pdf' });

  // Web Share API with files: shown only where the browser reports that it can share a PDF
  const shareBtn = form.querySelector('[data-act="share"]');
  try { if (navigator.canShare && navigator.canShare({ files: [new File([new Uint8Array(4)], 'x.pdf', { type: 'application/pdf' })] })) { shareBtn.hidden = false; root.querySelector('[data-share-help]').hidden = false; } } catch { /* not supported: download + WhatsApp text remain */ }

  async function act(name) {
    const d = read();
    if (name === 'print') { window.print(); return; }
    const problem = validate(d); showError(problem); if (problem) { form.querySelector('.sx-detect-error')?.scrollIntoView?.({ block: 'nearest' }); return; }
    if (name === 'wa') { track('detection_form_whatsapp_start'); window.open(`https://wa.me/${prices.whatsapp}?text=${encodeURIComponent(message(d))}`, '_blank', 'noopener'); return; }
    const bytes = await pdfBytes(d);
    if (name === 'pdf') {
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })), a = document.createElement('a');
      a.href = url; a.download = S.filename; document.body.append(a); a.click(); track('pdf_download');
      setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1500);
    } else if (name === 'share') {
      try { await navigator.share({ files: [pdfFile(bytes)], title: S.title }); track('pdf_download'); } catch (e) { if (e && e.name !== 'AbortError') showError(String(e.message || e)); }
    }
  }
  form.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b) { e.preventDefault(); act(b.dataset.act); } });
  // exposed for the automated test only (no data leaves the page)
  root.__detect = { read, message, validate, printable };
}
