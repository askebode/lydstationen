// ============================================================
//  Lydstationen
// ============================================================

// --- Årstal i footer ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Mobilmenu ---
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

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

// --- Nav baggrund ved scroll ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
});

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
