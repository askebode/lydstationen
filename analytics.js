// ============================================================
//  Lydstationen — tracking (Google Analytics 4 + Google Ads)
//
//  ▸ GA4 er AKTIVT (måle-ID nedenfor).
//  ▸ Google Ads konto-ID er AKTIVT → remarketing/målgrupper
//    bygges allerede. Der mangler kun konverterings-LABELS
//    for at tælle opkald og bookinger som konverteringer.
//
//  Sådan tænder du de sidste 2 konverteringer:
//    1) I Google Ads: opret en konvertering for "telefonopkald"
//       og en for "formular/booking".
//    2) For hver konvertering finder du "send to"-værdien, som
//       ser sådan ud: AW-17942137784/AbC-D_efGhIjKlMn
//    3) Indsæt telefon-værdien i ADS_CALL_LABEL og
//       booking-værdien i ADS_FORM_LABEL (erstat …/XXXXXXXX).
//       Færdig.
// ============================================================

// ── DINE ID'er ──────────────────────────────────────────────
var GA4_ID         = 'G-LFBWEKEN19';               // Google Analytics 4 — AKTIVT
var ADS_ID         = 'AW-17942137784';             // Google Ads konto-ID — AKTIVT
var ADS_CALL_LABEL = 'AW-17942137784/XXXXXXXX';    // Konvertering: telefonopkald (indsæt label)
var ADS_FORM_LABEL = 'AW-17942137784/f9yYCNmq1fYbELiXvetC'; // Konvertering: booking/formular — AKTIVT
// ────────────────────────────────────────────────────────────

function isSet(id) {
    return id && id.indexOf('XXXX') === -1;
}

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// ── Google Consent Mode v2 ──────────────────────────────────
//  Standard = tilladt (ingen samtykke-banner er valgt endnu).
//  Vil du senere have et cookie-banner, så sæt disse til
//  'denied' som udgangspunkt og opdatér ved klik på "Accepter".
gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
});

// ── Indlæs gtag.js og konfigurér de aktive tags ─────────────
(function () {
    var tagId = isSet(GA4_ID) ? GA4_ID : (isSet(ADS_ID) ? ADS_ID : null);
    if (!tagId) return; // intet konfigureret → indlæs ikke gtag

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + tagId;
    document.head.appendChild(s);

    gtag('js', new Date());
    if (isSet(GA4_ID)) gtag('config', GA4_ID);
    if (isSet(ADS_ID)) gtag('config', ADS_ID);
})();

// Hjælper: send en Google Ads-konvertering (kun hvis label er sat)
function adsConversion(sendTo) {
    if (isSet(sendTo)) gtag('event', 'conversion', { send_to: sendTo });
}

// ── Event-måling ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // Klik på telefon-links (tap-to-call) → KONVERTERING (opkald)
    //   dækker også den mobile "Ring nu"-bjælke, da den er et tel:-link.
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            gtag('event', 'opkald', {
                event_category: 'kontakt',
                event_label: link.getAttribute('href')
            });
            adsConversion(ADS_CALL_LABEL);
        });
    });

    // Klik på email-links (mailto:) → engagement
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            gtag('event', 'email_klik', { event_category: 'kontakt' });
        });
    });

    // Klik på "Book pakke"-knapper → engagement (hvilken pakke)
    document.querySelectorAll('[data-pakke]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            gtag('event', 'vaelg_pakke', {
                event_category: 'udlejning',
                event_label: btn.dataset.pakke
            });
        });
    });

    // Forsøg på at indsende formular → engagement (før svar)
    document.querySelectorAll('form').forEach(function (form) {
        form.addEventListener('submit', function () {
            gtag('event', 'formular_forsoeg', { event_category: 'kontakt' });
        });
    });

    // Scroll-dybde → engagement (hvor langt folk læser)
    var marks = [25, 50, 75, 90];
    var hit = {};
    window.addEventListener('scroll', function () {
        var doc = document.documentElement;
        var scrolled = doc.scrollTop + doc.clientHeight;
        var pct = doc.scrollHeight > 0 ? (scrolled / doc.scrollHeight) * 100 : 0;
        marks.forEach(function (m) {
            if (!hit[m] && pct >= m) {
                hit[m] = true;
                gtag('event', 'scroll_dybde', {
                    event_category: 'engagement',
                    event_label: m + '%'
                });
            }
        });
    }, { passive: true });
});

// ── KONVERTERING: booking/formular sendt ────────────────────
//  Fyres FØRST når Formspree svarer OK (se script.js), så vi
//  ikke tæller mislykkede eller afbrudte indsendelser med.
document.addEventListener('lydstationen:booking-success', function () {
    gtag('event', 'generate_lead', { event_category: 'kontakt' });
    adsConversion(ADS_FORM_LABEL);
});
