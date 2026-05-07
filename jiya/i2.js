(function() {
    // ── Initialize AOS ────────────────────────────
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-out-cubic',
    });

    // ── Initialize Lenis (smooth scroll) ──────────
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── Navbar scroll effect ──────────────────────
    const navbar = document.getElementById('navbar');
    lenis.on('scroll', ({ animatedScroll }) => {
        if (animatedScroll > 40) {
            navbar.classList.add('nav--solid');
        } else {
            navbar.classList.remove('nav--solid');
        }
    });

    // ── Scroll-to-top button ─────────────────────
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    lenis.on('scroll', ({ animatedScroll }) => {
        if (animatedScroll > 500) {
            scrollTopBtn.classList.add('scroll-top--visible');
        } else {
            scrollTopBtn.classList.remove('scroll-top--visible');
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1 });
    });

    // ── Mobile hamburger menu ────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('nav__hamburger--active');
        navLinks.classList.toggle('nav__links--open');
    });

    // ── Anchor link smooth scrolling with Lenis ──
    document.querySelectorAll('[data-nav-link]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Close mobile menu if open
                    hamburger.classList.remove('nav__hamburger--active');
                    navLinks.classList.remove('nav__links--open');
                    // Scroll
                    const offsetTop = target.getBoundingClientRect().top + (
                        window.scrollY || document
                        .documentElement.scrollTop);
                    lenis.scrollTo(offsetTop - 60, { duration: 1 });
                }
            }
        });
    });

    // ── Close mobile menu on outside click ───────
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains(
                'nav__links--open')) {
            hamburger.classList.remove('nav__hamburger--active');
            navLinks.classList.remove('nav__links--open');
        }
    });

    // ── Refresh AOS on Lenis scroll (for dynamic content) ──
    lenis.on('scroll', () => {
        // AOS refreshes automatically; this keeps things in sync
    });

    console.log('%c🖐️ Handcrafted portfolio for Nivedna — ready!',
        'color: #d46a4a; font-size: 1.1rem; font-weight: bold;');
    console.log('%cBuilt with Lenis + AOS + vanilla love.',
        'color: #5b6c9b;');
})();
