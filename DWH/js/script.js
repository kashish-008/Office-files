// Activate navbar link matching
(function () {
  try {
    const path = window.location.pathname.replace(/\/index\.html$/i, "/");
    const navLinks = document.querySelectorAll("a.nav-link");
    if (!navLinks) return;
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      // Normalize hrefs: treat "./", "index.html", and "/" as root
      const a = document.createElement("a");
      a.href = href;
      const linkPath = a.pathname.replace(/\/index\.html$/i, "/");
      if (linkPath === path) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  } catch (e) {
    // fail quietly
    console.error("nav active script error:", e);
  }
})();

// Initialize Lenis 
(function () {
  if (!window.Lenis) {
    console.warn("Lenis library not loaded");
    return;
  }

  try {
    const lenis = new window.Lenis({
      duration: 1.2,           
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: "vertical",   
      gestureDirection: "vertical",
      smoothWheel: true,       
      smoothTouch: false,      
      touchMultiplier: 2,     
    });

    // Animation loop for Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    window._lenis = lenis;

    console.log("Lenis smooth scroll initialized ✅");
  } catch (e) {
    console.error("Lenis init error:", e);
  }
})();

(function () {
  if (!window.AOS) {
    console.warn("AOS library not loaded");
    return;
  }

  try {
    AOS.init({
      duration: 700,              
      mirror: true,              
      offset: 100,                
      delay: 0,                   
      disable: false,           
      throttleDelay: 99,         
      anchorPlacement: "top-bottom", 
    });

    // Optional: Refresh AOS after page fully loads
    window.addEventListener("load", function () {
      try {
        AOS.refresh();
        console.log("AOS animations initialized ✅");
      } catch (e) {
        console.warn("AOS refresh error:", e);
      }
    });

  } catch (e) {
    console.error("AOS init error:", e);
  }
})();

// Optional: Refresh AOS when window resizes
(function () {
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      try {
        if (window.AOS) {
          AOS.refresh();
        }
      } catch (e) {}
    }, 100);
  });
})();