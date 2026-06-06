// ============================================================
//  Lydstationen
// ============================================================

// --- Årstal i footer ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Mobilmenu (kun sider med nav) ---
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', open);
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', false);
        });
    });
}

// --- Nav baggrund ved scroll ---
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });
}

// --- Landing: forudfyld pakke-felt ved klik på "Book pakke" ---
const pakkeField = document.getElementById('pakke');
if (pakkeField) {
    document.querySelectorAll('[data-pakke]').forEach(btn => {
        btn.addEventListener('click', () => {
            pakkeField.value = btn.dataset.pakke;
        });
    });
}

// --- Kundeliste: shuffle + filtrering ---
const clientList = document.querySelector('#client-list');

function shuffleList(list) {
    const items = Array.from(list.querySelectorAll('li'));
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    items.forEach(item => list.appendChild(item));
}

if (clientList) {
    shuffleList(clientList);
    const clients = Array.from(clientList.children);
    const filterInputs = document.querySelectorAll('[name="job"]');

    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            const checked = Array.from(document.querySelectorAll('[name="job"]:checked'));
            clients.forEach(client => {
                const jobs = (client.dataset.job || '').split(' ');
                const show = checked.length === 0 ||
                    checked.some(c => jobs.includes(c.value));
                client.style.display = show ? '' : 'none';
            });
        });
    });
}

// --- Kontaktformular: send uden at forlade siden (Formspree AJAX) ---
function showFormError(form, btn, original) {
    if (btn) { btn.disabled = false; btn.textContent = original; }
    if (!form.querySelector('.form-error')) {
        const p = document.createElement('p');
        p.className = 'form-error';
        p.textContent = 'Beskeden kunne ikke sendes lige nu. Prøv igen, eller ring/skriv direkte.';
        form.appendChild(p);
    }
}

document.querySelectorAll('form[action*="formspree"]').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn ? btn.textContent : '';
        const oldError = form.querySelector('.form-error');
        if (oldError) oldError.remove();
        if (btn) { btn.disabled = true; btn.textContent = 'Sender …'; }

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(res => {
            if (res.ok) {
                form.innerHTML =
                    '<div class="form-success">' +
                    '<h3>Tak for din besked!</h3>' +
                    '<p>Jeg vender tilbage hurtigst muligt. Haster det, er du velkommen til at ringe på ' +
                    '<a href="tel:+4522940935">+45 22 94 09 35</a>.</p>' +
                    '</div>';
            } else {
                showFormError(form, btn, original);
            }
        }).catch(() => showFormError(form, btn, original));
    });
});
