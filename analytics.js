// ============================================================
//  Lydstationen — tracking (Google Analytics 4 + Google Ads)
//  ▸ Indsæt dine egne ID'er herunder. Indtil de er udfyldt,
//    indlæses intet — så siden er ikke påvirket.
// ============================================================

// ── DINE ID'er ──────────────────────────────────────────────
var GA4_ID = 'G-XXXXXXXXXX';                 // Google Analytics 4 måle-ID
var ADS_ID = 'AW-XXXXXXXXX';                 // Google Ads konto-ID
var ADS_CALL_LABEL = 'AW-XXXXXXXXX/CallLabel'; // Konvertering: telefonopkald
var ADS_FORM_LABEL = 'AW-XXXXXXXXX/FormLabel'; // Konvertering: booking/formular
// ────────────────────────────────────────────────────────────

function isSet(id) {
    return id && id.indexOf('XXXX') === -1;
}

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

(function () {
    var tagId = isSet(GA4_ID) ? GA4_ID : (isSet(ADS_ID) ? ADS_ID : null);
    if (!tagId) return; // intet konfigureret endnu → indlæs ikke gtag

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + tagId;
    document.head.appendChild(s);

    gtag('js', new Date());
    if (isSet(GA4_ID)) gtag('config', GA4_ID);
    if (isSet(ADS_ID)) gtag('config', ADS_ID);
})();

// ── Event-måling: opkald + formular-submit ──────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Klik på telefon-links (tap-to-call)
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            gtag('event', 'opkald', { event_category: 'kontakt' });
            if (isSet(ADS_CALL_LABEL)) {
                gtag('event', 'conversion', { send_to: ADS_CALL_LABEL });
            }
        });
    });

    // Indsendelse af kontakt-/booking-formular
    document.querySelectorAll('form').forEach(function (form) {
        form.addEventListener('submit', function () {
            gtag('event', 'formular_send', { event_category: 'kontakt' });
            if (isSet(ADS_FORM_LABEL)) {
                gtag('event', 'conversion', { send_to: ADS_FORM_LABEL });
            }
        });
    });
});
