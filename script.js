/* ============================================================
   script.js — Michele Deponti Portfolio
   Funzionalità: reveal scroll, nav attiva (ottimizzata), drawer mobile, parallax orb
   ============================================================ */

/* ── 1. Reveal on scroll (IntersectionObserver) ──
   Aggiunge la classe .in agli elementi .rv quando entrano nel viewport,
   scatenando la transizione opacity+translateY definita in CSS. */
const revealOptions = {
  threshold: 0.08 // si attiva quando l'8% dell'elemento è visibile
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in'); // attiva l'animazione
      observer.unobserve(entry.target);  // osserva una sola volta per performance
    }
  });
}, revealOptions);

document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));


/* ── 2. Evidenziazione nav link attivo (Ottimizzata via Observer) ──
   Sostituisce il vecchio listener su 'scroll' evitando il Layout Thrashing.
   Usa un margine asimmetrico per intercettare accuratamente la sezione dominante. */
const navOptions = {
  root: null,
  rootMargin: '-30% 0px -60% 0px', // Si attiva quando la sezione occupa la fascia medio-alta
  threshold: 0
};

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // Gestiamo l'attivazione solo quando la sezione entra nell'area di focus
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      
      document.querySelectorAll('.nav-links a, .drawer-link').forEach(a => {
        const isActive = a.getAttribute('href') === `#${id}`;
        // Uso pulito delle classi CSS invece degli stili inline
        a.classList.toggle('active', isActive);
      });
    }
  });
}, navOptions);

// Osserva tutte le sezioni dotate di ID
document.querySelectorAll('section[id]').forEach(section => navObserver.observe(section));


/* ── 3. Hamburger / Drawer mobile ──
   Gestisce apertura e chiusura del menu laterale su mobile con attenzioni A11y. */
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('navDrawer');
const backdrop  = document.getElementById('drawerBackdrop');

/** Apre il drawer e blocca lo scroll del body. */
function openDrawer() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // impedisce lo scroll del contenuto sottostante
}

/** Chiude il drawer e ripristina lo scroll del body. */
function closeDrawer() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // riabilita lo scroll nativo
}

// Toggle al click sull'hamburger
hamburger.addEventListener('click', () => {
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});

// Click sul backdrop → chiude il drawer
backdrop.addEventListener('click', closeDrawer);

// Click su un link del drawer → chiude il drawer (naviga e chiude)
document.querySelectorAll('.drawer-link, .drawer-cta').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// Tasto Escape → chiude il drawer se aperto
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) {
    closeDrawer();
  }
});


/* ── 4. Parallax orb (Solo desktop con hover e movimento abilitato) ──
   Sposta l'orb in risposta al movimento del mouse nell'area hero-orb-wrap.
   Disabilitato se l'utente preferisce movimenti ridotti a livello di OS. */
const orb     = document.querySelector('.hero-orb');
const orbWrap = document.querySelector('.hero-orb-wrap');

// Verifica delle preferenze di accessibilità del sistema operativo
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsHover = window.matchMedia('(hover: hover)').matches;

if (orbWrap && orb && supportsHover && !prefersReducedMotion) {
  orbWrap.addEventListener('mousemove', e => {
    const rect = orbWrap.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;  // offset x dal centro
    const y = e.clientY - rect.top  - rect.height / 2; // offset y dal centro
    
    orb.style.setProperty('--mouse-x', `${x / 2}px`); // diviso 2 per attenuare l'effetto
    orb.style.setProperty('--mouse-y', `${y / 2}px`);
  });

  // Reset fluido della posizione quando il mouse lascia l'area
  orbWrap.addEventListener('mouseleave', () => {
    orb.style.setProperty('--mouse-x', '0px');
    orb.style.setProperty('--mouse-y', '0px');
  });
}
