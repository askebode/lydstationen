// ============================================================
//  Lydstationen — konverteringer og event-måling
//
//  Selve Google-tagget (gtag.js) indlæses direkte i <head> på
//  hver side — se "Google tag (gtag.js)"-blokken. Det er Googles
//  anbefalede opsætning og gør, at Googles "Test dit website"
//  kan finde tagget.
//
//  Denne fil indeholder KUN konverteringer og events.
//
//  Filen hedder bevidst ikke "analytics.js": mange annonce-
//  blokkere blokerer automatisk filer med det navn.
// ============================================================

// ── KONVERTERINGS-LABELS (fra Google Ads) ───────────────────
var ADS_CALL_LABEL = 'AW-17942137784/ULonCI_l0tscELiXvetC'; // Klik for at ringe
var ADS_FORM_LABEL = 'AW-17942137784/f9yYCNmq1fYbELiXvetC'; // Indsend kundeformular
// ────────────────────────────────────────────────────────────

// gtag defineres i <head>. Hvis tagget er blokeret, må siden
// ikke fejle — derfor denne sikre wrapper.
function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
}

// Bemærk: der sendes bevidst INGEN 'value' med herfra.
// Værdien sættes på hver konvertering inde i Google Ads
// (Mål → Konverteringer → vælg handlingen → Værdi), så den kan
// justeres uden at ændre koden. Sender tagget en værdi, vinder
// den nemlig over den, der er sat i Google Ads.
function adsConversion(sendTo) {
    if (!sendTo || sendTo.indexOf('XXXX') !== -1) return;
    track('conversion', { send_to: sendTo });
}

// ── Event-måling ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // Klik på telefon-links (tap-to-call) → KONVERTERING (opkald)
    //   dækker også den mobile "Ring nu"-bjælke, da den er et tel:-link.
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            track('opkald', {
                event_category: 'kontakt',
                event_label: link.getAttribute('href')
            });
            adsConversion(ADS_CALL_LABEL);
        });
    });

    // Klik på email-links (mailto:) → engagement
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            track('email_klik', { event_category: 'kontakt' });
        });
    });

    // Klik på "Book pakke"-knapper → engagement (hvilken pakke)
    document.querySelectorAll('[data-pakke]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            track('vaelg_pakke', {
                event_category: 'udlejning',
                event_label: btn.dataset.pakke
            });
        });
    });

    // Forsøg på at indsende formular → engagement (før svar)
    document.querySelectorAll('form').forEach(function (form) {
        form.addEventListener('submit', function () {
            track('formular_forsoeg', { event_category: 'kontakt' });
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
                track('scroll_dybde', {
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
    track('generate_lead', { event_category: 'kontakt' });
    adsConversion(ADS_FORM_LABEL);
});
