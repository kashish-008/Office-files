(function () {
  "use strict";

  // ─── Loader HTML inject — ek baar ───
  var loaderHTML = `
    <div id="page-loader">
      <div class="loader-inner">
        <span class="loader-brand">Precision Logistics</span>
        <div class="loader-bar-wrap">
          <div class="loader-bar"></div>
        </div>
      </div>
    </div>
  `;

  // Loader CSS inject — ek baar
  var loaderCSS = `
    #page-loader {
      position: fixed;
      inset: 0;
      background: #071d2f;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      transition: opacity 0.4s ease;
    }
    #page-loader.hide {
      opacity: 0;
      pointer-events: none;
    }
    .loader-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .loader-brand {
      font-family: 'Cal Sans', 'Segoe UI', sans-serif;
      font-size: 22px;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.9;
    }
    .loader-bar-wrap {
      width: 160px;
      height: 2px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      overflow: hidden;
    }
    .loader-bar {
      height: 100%;
      width: 0%;
      background: #01386d;
      border-radius: 2px;
      animation: loaderFill 0.9s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    @keyframes loaderFill {
      0%   { width: 0%; }
      100% { width: 100%; }
    }
  `;

  // CSS inject
  var styleTag = document.createElement('style');
  styleTag.textContent = loaderCSS;
  document.head.appendChild(styleTag);

  // ─── Loader show/hide functions ───
  function showLoader() {
    var existing = document.getElementById('page-loader');
    if (existing) existing.remove();

    var div = document.createElement('div');
    div.innerHTML = loaderHTML.trim();
    document.body.appendChild(div.firstElementChild);
  }

  function hideLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.add('hide');
    setTimeout(function () {
      if (loader.parentNode) loader.remove();
    }, 400);
  }

  // ─── initPage — har page load/transition pe ───
  function initPage() {

    // Navbar close button
    var toggler = document.querySelector(".navbar-toggler");
    var closeButton = document.querySelector(".navbar-close");
    if (toggler && closeButton) {
      closeButton.addEventListener("click", function () {
        toggler.click();
      });
    }

    // AOS
    if (window.AOS) {
      AOS.init({
        duration: 600,
        easing: "ease-out",
        once: false,
        mirror: false,
        offset: 80,
      });
    }

    // GSAP + ScrollTrigger
    var modernCopy = document.querySelector(".modern-copy");
    if (modernCopy && window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.getAll().forEach(function (t) { t.kill(); });

      var words = modernCopy.textContent.trim().split(/\s+/);
      modernCopy.textContent = "";

      words.forEach(function (word) {
        var wordSpan = document.createElement("span");
        wordSpan.className = "modern-word";
        wordSpan.textContent = word;
        modernCopy.appendChild(wordSpan);
        modernCopy.appendChild(document.createTextNode(" "));
      });

      var wordNodes = modernCopy.querySelectorAll(".modern-word");
      var modernWordColor = window.MODERN_WORD_COLOR || "#071D2F";

      gsap.fromTo(
        wordNodes,
        { color: "rgba(7, 29, 47, 0.25)", opacity: 0.35, y: 10 },
        {
          color: modernWordColor,
          opacity: 1,
          y: 0,
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: {
            trigger: modernCopy,
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        }
      );
    }

    // Lenis
    if (window.Lenis) {
      var lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.9,
      });

      if (window.ScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);
      }

      function raf(time) {
        lenis.raf(time);
        if (window.ScrollTrigger) ScrollTrigger.update();
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Swiper
    if (window.Swiper && document.querySelector(".choose-swiper")) {
      new Swiper(".choose-swiper", {
        slidesPerView: 1.2,
        spaceBetween: 16,
        scrollbar: {
          el: ".choose-swiper .swiper-scrollbar",
          draggable: true,
          hide: false,
        },
        breakpoints: {
          576: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          992: { slidesPerView: 4, spaceBetween: 24 },
        },
      });
    }

    // Links intercept
    attachLinks();
  }

  // ─── Page Transition ───
  function loadPage(url) {
    showLoader();

    fetch(url)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var newDoc = parser.parseFromString(html, "text/html");

        document.body.innerHTML = newDoc.body.innerHTML;
        window.history.pushState({}, "", url);
        window.scrollTo(0, 0);

        // Loader animation finish hone do phir hide karo
        setTimeout(function () {
          hideLoader();
          initPage();
        }, 900);
      })
      .catch(function () {
        window.location.href = url;
      });
  }

  // ─── Links intercept ───
  function attachLinks() {
    document.querySelectorAll("a[href]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");

        if (!href || href === "#" || href.startsWith("#")) return;
        if (
          href.startsWith("http") ||
          href.startsWith("mailto") ||
          href.startsWith("tel")
        ) return;

        e.preventDefault();
        loadPage(href);
      });
    });
  }

  // ─── Browser back/forward ───
  window.addEventListener("popstate", function () {
    loadPage(window.location.pathname);
  });

  // ─── First page load ───
  showLoader();
  window.addEventListener("load", function () {
    setTimeout(function () {
      hideLoader();
    }, 900);
  });

  initPage();

})();