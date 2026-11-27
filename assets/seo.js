// seo.js — progressive enhancement only (lightbox for the photo atlas / document gallery, and the identifier tool).
// Pages work without it: gallery items are plain links to the large image, tool outcomes are listed in HTML.
(() => {
  // ---------- lightbox ----------
  const links = [...document.querySelectorAll('a[data-lightbox]')];
  if (links.length && 'HTMLDialogElement' in window) {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    const t = lang === 'en' ? { close: 'Close', prev: 'Previous', next: 'Next', credit: 'Author and source', scale: 'Scale' } : { close: 'Cerrar', prev: 'Anterior', next: 'Siguiente', credit: 'Autor y fuente', scale: 'Escala' };
    const dlg = document.createElement('dialog');
    dlg.className = 'sx-lightbox'; dlg.setAttribute('aria-label', 'Image viewer');
    dlg.innerHTML = '<div class="sx-lightbox-inner"><img alt=""><div class="sx-lightbox-side"><p data-cap></p><p data-notes></p><p data-meta></p><div class="actions"><button type="button" class="button" data-prev></button><button type="button" class="button" data-next></button><button type="button" class="button yellow" data-close></button></div></div></div>';
    document.body.append(dlg);
    const img = dlg.querySelector('img'), q = s => dlg.querySelector(s);
    q('[data-prev]').textContent = t.prev; q('[data-next]').textContent = t.next; q('[data-close]').textContent = t.close;
    let i = 0, opener = null;
    const show = n => {
      i = (n + links.length) % links.length; const a = links[i];
      let d = {}; try { d = JSON.parse(a.dataset.notes || '{}'); } catch { /* no notes */ }
      const inner = a.querySelector('img'); const href = a.getAttribute('href');
      img.src = href.startsWith('#') ? (inner?.currentSrc || '') : href; img.alt = inner?.alt || '';
      q('[data-cap]').textContent = d.cap || inner?.alt || ''; q('[data-notes]').textContent = d.notes || '';
      q('[data-meta]').textContent = [d.scale && `${t.scale}: ${d.scale}`, d.credit && `${t.credit}: ${d.credit}`].filter(Boolean).join(' · ');
    };
    links.forEach((a, n) => a.addEventListener('click', e => { if (a.getAttribute('href').startsWith('#') && !a.querySelector('img')) return; e.preventDefault(); opener = a; show(n); dlg.showModal(); }));
    q('[data-close]').addEventListener('click', () => dlg.close());
    q('[data-prev]').addEventListener('click', () => show(i - 1));
    q('[data-next]').addEventListener('click', () => show(i + 1));
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
    dlg.addEventListener('close', () => opener?.focus());
  }

  // ---------- identifier tool ----------
  document.querySelectorAll('[data-tool-root]').forEach(root => {
    const form = root.querySelector('[data-tool]'), result = form.querySelector('.sx-tool-result');
    const outcomes = [...root.querySelectorAll('[data-outcomes] li')].map(li => ({ el: li, rule: JSON.parse(li.dataset.rule) }));
    const answers = () => Object.fromEntries([...form.querySelectorAll('fieldset')].map(f => [f.dataset.q, (f.querySelector('input:checked') || {}).value || null]));
    const matches = (rule, a) => {
      const yes = Object.entries(a).filter(([, v]) => v === 'yes').map(([k]) => k);
      if (rule.default) return true;
      if (rule.any && !rule.any.some(k => a[k] === 'yes')) return false;
      if (rule.all && !rule.all.every(k => a[k] === 'yes')) return false;
      if (rule.minYes != null && yes.length < rule.minYes) return false;
      if (rule.maxYes != null && yes.length > rule.maxYes) return false;
      return true;
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const a = answers(); const hit = outcomes.find(o => matches(o.rule, a));
      result.hidden = false; result.innerHTML = hit ? hit.el.innerHTML : '';
      result.querySelectorAll('strong').forEach(s => { const h = document.createElement('h3'); h.textContent = s.textContent; s.replaceWith(h); });
      result.tabIndex = -1; result.focus();
    });
    form.addEventListener('reset', () => { result.hidden = true; result.innerHTML = ''; });
  });
})();
