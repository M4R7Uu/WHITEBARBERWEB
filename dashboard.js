/* ==========================================
   VILLADIEGO ART — script.js (Landing Page)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 0. USAR LA INSTANCIA DE DB YA CREADA EN EL HTML
    // No necesitamos volver a inicializar Firebase aquí.
    
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    let fotosVisibles = 8; // Control de cantidad de fotos

    // 1. NAVBAR & MENU MOBILE
    window.addEventListener('scroll', () => {
        if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    // 2. SCROLL REVEAL (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    // 3. CARGAR SERVICIOS DINÁMICOS
    function cargarPrecios() {
        const lista = document.getElementById('precios-lista');
        if (!lista) return;

        db.ref('servicios').on('value', (snapshot) => {
            const data = snapshot.val();
            lista.innerHTML = ''; 

            if (data) {
                const servicios = Object.keys(data).map(key => data[key]);

                servicios.forEach((srv, i) => {
                    const item = document.createElement('div');
                    item.className = `precio-item ${srv.destacado ? 'precio-item--destaque' : ''}`;
                    
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;

                    const valorFinal = srv.precio.includes('$') ? srv.precio : `$${srv.precio}`;

                    item.innerHTML = `
                        ${srv.destacado ? '<div class="destaque-label">★ MÁS POPULAR</div>' : ''}
                        <div style="display:flex; justify-content:space-between; align-items:baseline; width:100%;">
                            <span class="precio-nombre">${srv.nombre}</span>
                            <span class="precio-puntos" style="flex:1; border-bottom:1px dotted #444; margin:0 10px;"></span>
                            <span class="precio-valor">${valorFinal}</span>
                        </div>
                        <p class="precio-desc">Servicio garantizado por FAMOUZ BARBERSHOP</p>
                    `;
                    
                    lista.appendChild(item);
                    setTimeout(() => observer.observe(item), 50);
                });
            }
        });
    }

    // 4. CARGAR GALERÍA DINÁMICA
    function cargarGaleriaDinamica() {
        const grid = document.getElementById('galeria-grid');
        const btnVerMas = document.getElementById('ver-mas-btn');
        if (!grid) return;

        db.ref('galeria').on('value', (snapshot) => {
            const data = snapshot.val();
            grid.innerHTML = '';
            
            if (data) {
                // Convertimos a array y ponemos las últimas subidas primero
                const fotos = Object.keys(data).map(key => data[key]).reverse();
                const fotosAMostrar = fotos.slice(0, fotosVisibles);

                fotosAMostrar.forEach((foto, i) => {
                    const item = document.createElement('div');
                    item.className = 'galeria-item';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
                    
                    item.innerHTML = `
                        <img src="${foto.src}" alt="Corte Villadiego" loading="lazy" />
                        <div class="galeria-overlay"><span>VER TRABAJO</span></div>
                    `;
                    grid.appendChild(item);
                    setTimeout(() => observer.observe(item), 50);
                });

                if (btnVerMas) {
                    btnVerMas.style.display = (fotosVisibles >= fotos.length) ? 'none' : 'inline-block';
                }
            }
        });
    }

    // EVENTO "VER MÁS" FUERA DE LA FUNCIÓN DE CARGA (Para evitar duplicidad)
    const btnVerMas = document.getElementById('ver-mas-btn');
    if (btnVerMas) {
        btnVerMas.addEventListener('click', () => {
            fotosVisibles += 4;
            cargarGaleriaDinamica(); 
        });
    }

    // 5. REVELAR ELEMENTOS ESTÁTICOS
    document.querySelectorAll('.hero-content, .artista-block, .citas-inner').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Iniciar cargas
    cargarPrecios();
    cargarGaleriaDinamica();

    // 6. ACTIVE NAV LINK ON SCROLL
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) current = sec.getAttribute('id');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
        });
    });
});