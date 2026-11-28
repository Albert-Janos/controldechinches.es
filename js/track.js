// CENTRAL CONVERSION-EVENT HOOK (prepared for the later, separate consent/Google Ads/GA4/GTM work package).
// Nothing is loaded or sent from here: track(name) only dispatches a DOM CustomEvent 'cdc:track' with a whitelisted event NAME and no payload.
// A future integration listens ONCE:  window.addEventListener('cdc:track', e => { /* e.detail.name */ })  (after consent, in js/main.js or a tag manager).
// Personal data (names, phone numbers, filled form fields, WhatsApp message text, prices typed by a customer) must NEVER be passed on.
// Opening WhatsApp is only an intent signal - it does not prove that a message was sent or that an order exists.
export const TRACK_EVENTS = Object.freeze([
  'whatsapp_click',            // normal WhatsApp buttons (a[href*="wa.me"], data-cta): already handled by js/main.js, listed here for the integration map
  'phone_click',               // tel: links (js/main.js)
  'calculator_use',            // first interaction with the price calculator
  'calculator_complete',       // calculator reached a complete quote (town chosen)
  'quote_whatsapp_start',      // customer opened WhatsApp with the calculated quote
  'detection_form_whatsapp_start', // customer opened WhatsApp with the online detection form text
  'pdf_download',              // any PDF download (blank resources, blank or filled detection form)
]);
export function track(name) {
  if (!TRACK_EVENTS.includes(name)) return false;
  try { window.dispatchEvent(new CustomEvent('cdc:track', { detail: { name } })); } catch { /* ignore */ }
  return true;
}
// Declarative variant: any element with data-track="<event>" fires it on click (used for PDF download links).
export function bindDeclarativeTracking(root = document) {
  root.addEventListener('click', e => { const el = e.target.closest?.('[data-track]'); if (el) track(el.dataset.track); });
}
