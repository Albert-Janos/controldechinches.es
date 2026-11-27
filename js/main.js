
import { measurement } from './measurement-config.js?v=2';

const ga4Id = /^G-[A-Z0-9]{5,}$/.test(measurement.ga4Id) ? measurement.ga4Id : '';
const adsId = /^AW-\d+$/.test(measurement.adsId) ? measurement.adsId : '';

const adsLabels = {
  whatsapp_click: measurement.whatsappLabel,
  phone_click: measurement.phoneLabel,
};

const hasAds = Boolean(
  adsId && Object.values(adsLabels).some(validLabel)
);

const hasMeasurement = Boolean(ga4Id || hasAds);
const isEnglish = document.documentElement.lang === 'en';
const openMenuLabel = isEnglish ? 'Open menu' : 'Abrir menú';
const closeMenuLabel = isEnglish ? 'Close menu' : 'Cerrar menú';
const storageKey = 'cdc_privacy_v2';
const maxAge = 180 * 24 * 60 * 60 * 1000;
const optOut = { analytics: false, ads: false };
const configured = new Set();

let preferences = hasMeasurement ? readPreferences() : null;
let tagRequested = false;

function validLabel(value) {
  return typeof value === 'string'
    && /^[A-Za-z0-9_-]+$/.test(value);
}

function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));

    if (
      !saved ||
      typeof saved.analytics !== 'boolean' ||
      typeof saved.ads !== 'boolean' ||
      !Number.isFinite(saved.savedAt) ||
      saved.savedAt > Date.now() ||
      Date.now() - saved.savedAt > maxAge
    ) {
      return null;
    }

    return saved;
  } catch {
    return null;
  }
}

function gtag() {
  window.dataLayer.push(arguments);
}

function consentState(choice) {
  return {
    analytics_storage:
      ga4Id && choice.analytics ? 'granted' : 'denied',

    ad_storage:
      hasAds && choice.ads ? 'granted' : 'denied',

    ad_user_data:
      hasAds && choice.ads ? 'granted' : 'denied',

    ad_personalization: 'denied',
  };
}

function applyMeasurement(choice) {
  const analytics = Boolean(ga4Id && choice.analytics);
  const advertising = Boolean(hasAds && choice.ads);

  if (!tagRequested && !analytics && !advertising) {
    return;
  }

  if (!tagRequested) {
    tagRequested = true;

    window.dataLayer = window.dataLayer || [];

    gtag('consent', 'default', consentState(optOut));
    gtag('set', 'ads_data_redaction', true);
    gtag('set', 'allow_ad_personalization_signals', false);

    gtag(
      'set',
      'page_location',
      location.origin + location.pathname
    );

    let referrerOrigin = '';

    if (document.referrer) {
      try {
        referrerOrigin = new URL(document.referrer).origin;
      } catch {
        referrerOrigin = '';
      }
    }

    gtag('set', 'page_referrer', referrerOrigin);
    gtag('js', new Date());

    const script = document.createElement('script');
    script.async = true;

    script.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      (analytics ? ga4Id : adsId);

    document.head.append(script);
  }

  gtag('consent', 'update', consentState(choice));

  if (ga4Id) {
    window['ga-disable-' + ga4Id] = !analytics;
  }

  if (analytics && !configured.has(ga4Id)) {
    gtag('config', ga4Id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    configured.add(ga4Id);
  }

  if (advertising && !configured.has(adsId)) {
    gtag('config', adsId, {
      send_page_view: false,
      allow_ad_personalization_signals: false,
    });

    configured.add(adsId);
  }
}

/* =========================================
   PRIVACIDAD Y CONSENTIMIENTO
========================================= */

function initPrivacy() {
  if (!hasMeasurement) return;

  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <aside
      id="privacy-banner"
      class="privacy-banner"
      aria-label="${isEnglish ? "Privacy preferences" : "Preferencias de privacidad"}"
      hidden
    >
      <div class="privacy-inner">
        <div>
          <strong>${isEnglish ? "Privacy preferences" : "Preferencias de privacidad"}</strong>
          <p>
            ${isEnglish ? "With your permission, we use optional tags for the purposes you select." : "Con tu permiso usamos etiquetas opcionales para los fines que elijas."}
            <a href="/politica-privacidad.html#cookies">
              ${isEnglish ? "More information (Spanish)" : "Más información"}
            </a>
          </p>
        </div>

        <div class="privacy-actions">
          <button type="button" data-privacy-choice="reject">
            ${isEnglish ? "Reject" : "Rechazar"}
          </button>

          <button type="button" data-privacy-choice="accept">
            ${isEnglish ? "Accept" : "Aceptar"}
          </button>

          <button type="button" data-cookie-settings>
            ${isEnglish ? "Settings" : "Configurar"}
          </button>
        </div>
      </div>
    </aside>

    <dialog
      id="privacy-dialog"
      class="privacy-dialog"
      aria-labelledby="privacy-title"
    >
      <div class="privacy-panel">
        <h2 id="privacy-title">
          ${isEnglish ? "Privacy settings" : "Configuración de privacidad"}
        </h2>

        <p>
          ${isEnglish ? "Your choices are stored in this browser. You can change them at any time." : "El sitio conserva tu elección en este navegador. Puedes modificarla en cualquier momento."}
        </p>

        <label id="privacy-analytics-row">
          <input type="checkbox" id="privacy-analytics">
          ${isEnglish ? "Analytics" : "Estadísticas"}
        </label>

        <label id="privacy-ads-row">
          <input type="checkbox" id="privacy-ads">
          ${isEnglish ? "Advertising measurement" : "Medición de anuncios"}
        </label>

        <p
          id="privacy-storage-error"
          role="status"
          hidden
        >
          ${isEnglish ? "We couldn’t save your settings. You can try again or block the tags in your browser." : "No se ha podido guardar el cambio. Puedes bloquear las etiquetas en el navegador o volver a intentarlo."}
        </p>

        <div class="privacy-actions">
          <button type="button" data-privacy-choice="reject">
            ${isEnglish ? "Reject all" : "Rechazar todo"}
          </button>

          <button type="button" data-privacy-choice="save">
            ${isEnglish ? "Save" : "Guardar"}
          </button>

          <button type="button" data-privacy-choice="close">
            ${isEnglish ? "Close" : "Cerrar"}
          </button>
        </div>
      </div>
    </dialog>
    `
  );

  const banner = document.getElementById('privacy-banner');
  const dialog = document.getElementById('privacy-dialog');

  const analyticsInput =
    document.getElementById('privacy-analytics');

  const adsInput =
    document.getElementById('privacy-ads');

  const storageError =
    document.getElementById('privacy-storage-error');

  document.getElementById('privacy-analytics-row').hidden =
    !ga4Id;

  document.getElementById('privacy-ads-row').hidden =
    !hasAds;

  const syncBanner = () => {
    banner.hidden = Boolean(preferences);

    document.documentElement.style.setProperty(
      '--privacy-offset',
      banner.offsetHeight + 'px'
    );
  };

  syncBanner();

  if ('ResizeObserver' in window) {
    new ResizeObserver(syncBanner).observe(banner);
  }

  function openSettings() {
    analyticsInput.checked = Boolean(
      ga4Id && preferences?.analytics
    );

    adsInput.checked = Boolean(
      hasAds && preferences?.ads
    );

    storageError.hidden = true;

    if (!dialog.open) {
      dialog.showModal();
    }
  }

  function save(choice) {
    const next = {
      ...choice,
      savedAt: Date.now(),
    };

    const reload =
      (configured.has(ga4Id) && !next.analytics) ||
      (configured.has(adsId) && !next.ads);

    let persisted = true;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(next)
      );
    } catch {
      persisted = false;

      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Almacenamiento no disponible.
      }
    }

    preferences = next;

    applyMeasurement(next);
    syncBanner();

    if (reload && persisted) {
      location.reload();
      return;
    }

    if (!persisted) {
      if (!dialog.open) {
        openSettings();
      }

      storageError.hidden = false;
      return;
    }

    const focusWasInBanner =
      banner.contains(document.activeElement);

    if (dialog.open) {
      dialog.close();
    }

    if (
      focusWasInBanner ||
      document.activeElement === document.body
    ) {
      document.getElementById('contenido')?.focus({
        preventScroll: true,
      });
    }
  }

  function acceptAll() {
    return {
      analytics: Boolean(ga4Id),
      ads: hasAds,
    };
  }

  const choices = {
    accept: () => save(acceptAll()),

    reject: () => save(optOut),

    save: () => save({
      analytics: Boolean(
        ga4Id && analyticsInput.checked
      ),

      ads: Boolean(
        hasAds && adsInput.checked
      ),
    }),

    close: () => dialog.close(),
  };

  document
    .querySelectorAll('[data-cookie-settings]')
    .forEach(button => {
      button.hidden = false;

      const item = button.closest(
        '[data-privacy-item]'
      );

      if (item) {
        item.hidden = false;
      }

      button.addEventListener(
        'click',
        openSettings
      );
    });

  document
    .querySelectorAll('[data-privacy-choice]')
    .forEach(button => {
      const action =
        choices[button.dataset.privacyChoice];

      if (action) {
        button.addEventListener(
          'click',
          action
        );
      }
    });

  if (preferences) {
    applyMeasurement(preferences);
  }
}

/* =========================================
   MENÚ MÓVIL
========================================= */

function initMobileMenu() {
  const dialog =
    document.getElementById('mobMenu') ||
    document.getElementById('mobile-menu');

  const openButton =
    document.getElementById('mobOpen') ||
    document.querySelector('.site-nav .hamburger');

  const closeButton =
    document.getElementById('mobClose') ||
    dialog?.querySelector('.mob-close');

  if (!dialog || !openButton || !closeButton) {
    return;
  }

  const desktop = window.matchMedia(
    '(min-width: 769px)'
  );

  document.documentElement.classList.add(
    'mobile-menu-ready'
  );

  openButton.setAttribute(
    'aria-controls',
    dialog.id
  );

  openButton.setAttribute(
    'aria-expanded',
    'false'
  );

  function openMenu() {
    if (dialog.open) return;

    dialog.showModal();

    openButton.setAttribute(
      'aria-expanded',
      'true'
    );

    openButton.setAttribute(
      'aria-label',
      closeMenuLabel
    );
  }

  function closeMenu() {
    if (dialog.open) {
      dialog.close();
    }
  }

  openButton.addEventListener('click', () => {
    if (dialog.open) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeButton.addEventListener(
    'click',
    closeMenu
  );

  dialog.addEventListener('close', () => {
    openButton.setAttribute(
      'aria-expanded',
      'false'
    );

    openButton.setAttribute(
      'aria-label',
      openMenuLabel
    );
  });

  dialog.addEventListener('click', event => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  desktop.addEventListener('change', event => {
    if (event.matches && dialog.open) {
      closeMenu();
    }
  });
}

/* =========================================
   SEGUIMIENTO DE CONTACTOS
========================================= */

function trackContactClick(event) {
  if (
    !preferences ||
    !tagRequested ||
    event.defaultPrevented
  ) {
    return;
  }

  if (
    event.type === 'auxclick' &&
    event.button !== 1
  ) {
    return;
  }

  const link =
    event.target.closest?.('a[data-cta]');

  if (!link) return;

  const name =
    link.protocol === 'tel:'
      ? 'phone_click'
      : link.origin === 'https://wa.me'
        ? 'whatsapp_click'
        : '';

  if (!name) return;

  const analytics = Boolean(
    ga4Id && preferences.analytics
  );

  const label = adsLabels[name];

  const advertising = Boolean(
    hasAds &&
    preferences.ads &&
    validLabel(label)
  );

  if (!analytics && !advertising) {
    return;
  }

  const metadata = {
    page_type: document.body.dataset.page,
    cta_position: link.dataset.cta,
    language: document.documentElement.lang,
  };

  if (analytics) {
    gtag('event', name, {
      ...metadata,
      send_to: ga4Id,
    });
  }

  if (advertising) {
    gtag('event', 'conversion', {
      ...metadata,
      send_to: adsId + '/' + label,
    });
  }
}

/* =========================================
   INICIALIZACIÓN
========================================= */

function init() {
  initMobileMenu();
  initPrivacy();

  const backToTop =
    document.querySelector('.back-top');

  if (backToTop) {
    const syncBackToTop = () => {
      backToTop.hidden =
        window.scrollY < 400 &&
        document.activeElement !== backToTop;
    };

    window.addEventListener(
      'scroll',
      syncBackToTop,
      { passive: true }
    );

    backToTop.addEventListener(
      'blur',
      syncBackToTop
    );

    syncBackToTop();
  }

  if (hasMeasurement) {
    document.addEventListener(
      'click',
      trackContactClick
    );

    document.addEventListener(
      'auxclick',
      trackContactClick
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    init,
    { once: true }
  );
} else {
  init();
}
