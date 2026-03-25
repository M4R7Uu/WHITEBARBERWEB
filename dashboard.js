/* ============================
   VILLADIEGO ART — script.js
   ============================ */

// ---- NAVBAR: scroll shadow + hamburger ----
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- GALERÍA: "Ver Más Cortes" ----
const extraPhotos = [
  { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80', label: 'FADE BAJO' },
  { src: 'https://images.unsplash.com/photo-1634537945498-bca4d2c32756?w=600&q=80', label: 'TEXTURIZADO' },
  { src: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80', label: 'CLÁSICO MODERNO' },
];

const verMasBtn   = document.getElementById('ver-mas-btn');
const galeriaGrid = document.getElementById('galeria-grid');
let extraShown = false;

verMasBtn.addEventListener('click', () => {
  if (extraShown) return;
  extraShown = true;
  verMasBtn.textContent = 'CARGANDO...';
  verMasBtn.disabled = true;

  setTimeout(() => {
    extraPhotos.forEach(photo => {
      const item = document.createElement('div');
      item.className = 'galeria-item';
      item.style.opacity = '0';
      item.style.transition = 'opacity 0.5s ease';
      item.innerHTML = `
        <img src="${photo.src}" alt="${photo.label}" loading="lazy" />
        <div class="galeria-overlay"><span>${photo.label}</span></div>
      `;
      galeriaGrid.appendChild(item);
      setTimeout(() => { item.style.opacity = '1'; }, 50);
    });

    verMasBtn.textContent = 'TODO CARGADO ✓';
    verMasBtn.style.borderColor = '#555';
    verMasBtn.style.color = '#555';
    verMasBtn.style.cursor = 'default';
  }, 600);
});

// ---- PRECIOS: cargar desde localStorage (soporta lista dinámica) ----
function cargarPrecios() {
  // Primero intenta lista dinámica nueva
  const dynSaved = localStorage.getItem('villadiego_servicios');
  if (dynSaved) {
    const servicios = JSON.parse(dynSaved);
    const lista = document.getElementById('precios-lista');
    if (!lista) return;
    lista.innerHTML = '';
    servicios.forEach(srv => {
      const item = document.createElement('div');
      item.className = 'precio-item' + (srv.destacado ? ' precio-item--destaque' : '');
      if (srv.destacado) {
        item.innerHTML = `
          <div class="destaque-label">★ MÁS POPULAR</div>
          <span class="precio-nombre">${srv.nombre}</span>
          <span class="precio-puntos"></span>
          <span class="precio-valor">${srv.precio}</span>
          <p class="precio-desc">Corte + Barba + Cejas + Hidratación</p>`;
      } else {
        item.innerHTML = `
          <span class="precio-nombre">${srv.nombre}</span>
          <span class="precio-puntos"></span>
          <span class="precio-valor">${srv.precio}</span>`;
      }
      lista.appendChild(item);
    });
    return;
  }
  // Fallback: formato antiguo por data-key
  const saved = localStorage.getItem('villadiego_precios');
  if (!saved) return;
  const precios = JSON.parse(saved);
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (precios[key]) el.textContent = precios[key];
  });
}
cargarPrecios();

// ---- SCROLL REVEAL (Intersection Observer) ----
const revealTargets = document.querySelectorAll(
  '.hero-content, .galeria-item, .precio-item, .artista-block, .citas-inner'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
  observer.observe(el);
});

// ---- ACTIVE NAV LINK on scroll ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
  });
});