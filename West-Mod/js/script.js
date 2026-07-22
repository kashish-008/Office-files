$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  // ================================
  // SMOOTH SCROLL (LENIS) - OPTIMIZED FOR MOBILE
  // ================================
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Always initialize Lenis but with mobile-friendly settings
  const lenis = new Lenis({
    duration: isMobile ? 0.6 : 1.2,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // Critical: keep false for mobile
    wheelMultiplier: isMobile ? 0.5 : 1.2,
    lerp: isMobile ? 0.15 : 0.08,
    touchMultiplier: isMobile ? 1.2 : 1.5,
    syncTouch: true,
    infinite: false,
  });

  // Always use Lenis for scroll handling
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Override Lenis for mobile scroll to be more native-like
  if (isMobile) {
    // Let touch events pass through more naturally
    lenis.options.smoothTouch = false;
    lenis.options.syncTouch = true;
  }

  $('a[href*="#"]').on("click", function (e) {
    const target = $(this).attr("href");
    if (target.startsWith("#") && $(target).length) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    }
  });

  // ================================
  // ANIMATION: counterAnimation
  // ================================
  let hasAnimated = false;
  const $window = $(window);
  const $numbersSec = $(".numbers-sec");

  function isInViewport($el) {
    const elementTop = $el.offset().top;
    const elementBottom = elementTop + $el.outerHeight();
    const viewportTop = $window.scrollTop();
    const viewportBottom = viewportTop + $window.height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  function animateCounters() {
    $(".numbers-sec h1").each(function () {
      const $this = $(this);
      const target = parseInt($this.data("target"));
      const span = $this.find("span").prop("outerHTML") || "";

      $({ countNum: 0 }).animate(
        { countNum: target },
        {
          duration: 2000,
          easing: "swing",
          step: function () {
            $this.html(Math.floor(this.countNum) + span);
          },
          complete: function () {
            $this.html(target.toLocaleString() + span);
          },
        },
      );
    });
  }

  $window.on("scroll load", function () {
    if (isInViewport($numbersSec) && !hasAnimated) {
      hasAnimated = true;
      animateCounters();
    }
  });

  // ================================
  // ANIMATION: wordWrapper
  // ================================
  $(".move-txt h5").each(function () {
    const words = $(this).text().trim().split(/\s+/);
    $(this).html(
      words.map((word) => `<span class="word">${word}</span>`).join(" "),
    );
  });

  gsap.set(".move-txt .word", { color: "#24202169" });

  // ================================
  // ANIMATION: movingSvgReveal
  // ================================

  const mm2 = gsap.matchMedia();

  // First section animation
  mm2.add("(min-width:767px)", () => {
    const movingSvgReveal1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".moving-svg-sec-1",
        start: "top top",
        end: "+=150%",
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    movingSvgReveal1.to(
      ".moving-svg-sec-1 .moving-img img",
      {
        yPercent: -10,
        scale: 1.15,
        ease: "none",
      },
      0,
    );

    movingSvgReveal1.fromTo(
      ".moving-svg-sec-1 .moving-img img",
      {
        filter: "blur(10px)",
        xPercent: 5,
        scale: 1.1,
      },
      {
        filter: "blur(0px)",
        scale: 1.2,
        xPercent: -10,
        ease: "none",
      },
      0.2,
    );

    movingSvgReveal1.to(
      ".moving-svg-sec-1 .move-txt .word",
      {
        color: "#000",
        textShadow:
          "0 0 6px rgba(45,83,144,0.35), 0 0 10px rgba(45,83,144,0.2)",
        stagger: 0.08,
        ease: "none",
      },
      0,
    );

    movingSvgReveal1.to(
      ".moving-svg-sec-1 .move-txt .word",
      {
        textShadow: "0 0 0 rgba(0,0,0,0)",
        stagger: 0.08,
        ease: "none",
      },
      0.5,
    );

    movingSvgReveal1.fromTo(
      ".moving-svg-sec-1 .roling-svg",
      { y: 0 },
      { y: 200, ease: "none", duration: 5 },
      0,
    );
  });

  // Second section animation (reversed)
  mm2.add("(min-width:767px)", () => {
    const movingSvgReveal2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".moving-svg-sec-2",
        start: "top top",
        end: "+=150%",
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    // Different direction for reversed layout
    movingSvgReveal2.to(
      ".moving-svg-sec-2 .moving-img img",
      {
        yPercent: -10,
        scale: 1.15,
        ease: "none",
      },
      0,
    );

    movingSvgReveal2.fromTo(
      ".moving-svg-sec-2 .moving-img img",
      {
        filter: "blur(10px)",
        xPercent: -5, // Changed direction
        scale: 1.1,
      },
      {
        filter: "blur(0px)",
        scale: 1.2,
        xPercent: 10, // Changed direction
        ease: "none",
      },
      0.2,
    );

    movingSvgReveal2.to(
      ".moving-svg-sec-2 .move-txt .word",
      {
        color: "#000",
        textShadow:
          "0 0 6px rgba(45,83,144,0.35), 0 0 10px rgba(45,83,144,0.2)",
        stagger: 0.08,
        ease: "none",
      },
      0,
    );

    movingSvgReveal2.to(
      ".moving-svg-sec-2 .move-txt .word",
      {
        textShadow: "0 0 0 rgba(0,0,0,0)",
        stagger: 0.08,
        ease: "none",
      },
      0.5,
    );

    movingSvgReveal2.fromTo(
      ".moving-svg-sec-2 .roling-svg",
      { y: 0 },
      { y: 200, ease: "none", duration: 5 },
      0,
    );
  });
  mm2.add("(max-width: 767px)", () => {
    const text = document.querySelector(".move-txt h5");

    text.innerHTML = text.textContent
      .split(" ")
      .map((word) => `<span class="word">${word}</span>`)
      .join(" ");

    gsap.to(".move-txt .word", {
      color: "#000",
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        trigger: ".move-txt",
        start: "top 80%",
        end: "top 40%",
        scrub: true,
      },
    });
  });

  // ================================
  // ANIMATION: studio3dReveal
  // ================================
  const mm4 = gsap.matchMedia();

  mm4.add(
    {
      sm: "(min-width: 576px)",
      lg: "(min-width: 1200px)",
    },
    (context) => {
      const { sm, lg } = context.conditions;

      const studio3dReveal = gsap.timeline({
        scrollTrigger: {
          trigger: ".studio-sec",
          start: "top top",
          end: "+=400%",
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // base animations (576px+)
      studio3dReveal.from(".studio-sec", {
        scale: 0.98,
        opacity: 0.7,
        duration: 2,
        ease: "power3.out",
      });

      studio3dReveal.from(
        ".badge-txt2",
        { y: 300, duration: 2, scale: 0, opacity: 0.5 },
        0,
      );

      studio3dReveal.from(
        ".heading1",
        { y: 400, duration: 2, scale: 0, opacity: 0 },
        1,
      );

      studio3dReveal.from(
        ".heading2",
        { y: 500, duration: 2, opacity: 0, scale: 0 },
        2,
      );

      // only 1200px+
      if (lg) {
        studio3dReveal.from(
          ".crvgsap1",
          { width: "700px", opacity: 0, duration: 3 },
          1,
        );

        studio3dReveal.from(
          ".crvgsap2",
          { width: "700px", top: -1, right: -3, duration: 3 },
          1,
        );
      }
    },
  );

  // ================================
  // ANIMATION: poolFeatureSteps
  // ================================
  const mm5 = gsap.matchMedia();

  mm5.add("(min-width: 767px)", () => {
    gsap.set(".pool-parts img", {
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "50%",
      opacity: 0,
      scale: 0.8,
    });
    gsap.set(".pool-list a", { opacity: 0, x: 50 });
    gsap.set(".pool-decp .pool-bx", { opacity: 0, y: 80 });
    gsap.set(".pool1, .pool3", { opacity: 0, scale: 0 });

    // const pieces = document.querySelectorAll(".piece");

    const poolFeatureSteps = gsap.timeline({
      scrollTrigger: {
        trigger: ".pool-wrap",
        start: "top top",
        end: "+=360%",
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    poolFeatureSteps
      .to({}, { duration: 1 })
      .to(
        ".main-join",
        {
          opacity: 0,
          filter: "blur(8px)",
          duration: 3,
          stagger: { amount: 0.5, from: "bottom" },
        },
        0,
      )
      .to(".pool7", { opacity: 0 }, 0)
      .to(
        ".pool1",
        { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 1 },
        "-=0.7",
      )
      .to("#structurePart", { opacity: 1, scale: 1, y: 0, duration: 1 })
      .to(".pool-item1", { opacity: 1, x: 0, duration: 0.3 }, "<")
      .to(
        ".pool-decp .pool-bx:nth-child(1)",
        { opacity: 1, y: 0, duration: 0.4 },
        "<",
      )
      .to(".pool3", { opacity: 1, scale: 1, duration: 1 })
      .to("#hydraulicsPart", { opacity: 1, scale: 1, y: 0, duration: 1 })
      .to(".pool-item2", { opacity: 1, x: 0, duration: 0.3 }, "<")
      .to(
        ".pool-decp .pool-bx:nth-child(1)",
        { opacity: 0, y: -40, duration: 0.3 },
        "<",
      )
      .to(
        ".pool-decp .pool-bx:nth-child(2)",
        { opacity: 1, y: 0, duration: 0.4 },
        "<",
      )
      .to("#interiorFinishPart", { opacity: 1, scale: 1, y: 0, duration: 1 })
      .to(".pool-item3", { opacity: 1, x: 0, duration: 0.3 }, "<")
      .to(
        ".pool-decp .pool-bx:nth-child(2)",
        { opacity: 0, y: -40, duration: 0.3 },
        "<",
      )
      .to(
        ".pool-decp .pool-bx:nth-child(3)",
        { opacity: 1, y: 0, duration: 0.4 },
        "<",
      )
      .to("#decksystemPart", { opacity: 1, scale: 1, y: 0, duration: 1 })
      .to(".pool8", {
        width: "600px",
        opacity: 1,
        scale: 1,
        y: "25vh",
        duration: 1,
      })
      .to(".pool-item4", { opacity: 1, x: 0, duration: 0.3 }, "<")
      .to(
        ".pool-decp .pool-bx:nth-child(3)",
        { opacity: 0, y: -40, duration: 0.3 },
        "<",
      )
      .to(
        ".pool-decp .pool-bx:nth-child(4)",
        { opacity: 1, y: 0, duration: 0.4 },
        "<",
      );
  });

  // ================================
  // ANIMATION: customizeStepReveal
  // ================================
  const mm7 = gsap.matchMedia();

  mm7.add("(min-width: 768px)", () => {
    const boxes = gsap.utils.toArray(".cust-left .cust-box");
    const images = gsap.utils.toArray(".cust-right .cust-box-desc");
    const section = document.querySelector(".customize-studio");

    boxes.forEach((box, i) => {
      gsap.set(box, { opacity: 0, y: 80, scale: 0.95 });
      gsap.set(images[i], { opacity: 0, y: 60, scale: 0.95 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".customize-studio",
        start: "top top",
        end: "+=300%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      },
    });

    boxes.forEach((box, i) => {
      tl.to(box, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      }).to(
        images[i],
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        "<",
      );

      if (i < boxes.length - 1) {
        tl.to(box, {
          opacity: 0,
          y: -60,
          scale: 0.95,
          duration: 1.2,
          ease: "power2.in",
        }).to(
          images[i],
          {
            opacity: 0,
            y: -40,
            scale: 0.95,
            duration: 1.2,
            ease: "power2.in",
          },
          "<",
        );
      }
    });
  });
  // ================================
  // ANIMATION: sliderInit
  // ================================
  $(".pool-slider-wrap").slick({
    slidesToShow: 2,
    speed: 1600,
    cssEase: "cubic-bezier(0.22, 1, 0.36, 1)",
    arrows: false,
    swipeToSlide: false,
    touchThreshold: 25,
    edgeFriction: 0.5,
    draggable: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  });

  // ================================
  // ANIMATION: dragCursor
  // ================================
  const cursor = document.querySelector(".drag-cursor");
  const slider = document.querySelector(".pool-slider");
  if (slider) {
    slider.addEventListener("mousemove", (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  }

  // ================================
  // ANIMATION: modernBgReveal
  // ================================
  const mm8 = gsap.matchMedia();

  mm8.add("(min-width: 768px)", () => {
    const modernGsap = gsap.timeline({
      scrollTrigger: {
        trigger: ".modern-design",
        start: "top top",
        end: "+=200%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onToggle: (self) => section.classList.toggle("active", self.isActive),
      },
    });

    modernGsap.from(
      ".modern-bg",
      {
        scale: 0.6,
        borderRadius: 25,
        opacity: 0.9,
        duration: 2,
      },
      0,
    );

    modernGsap.from(".modern-design h3", {
      opacity: 0,
      y: 60,
      filter: "blur(10px)",
      duration: 1.2,
      ease: "power4.out",
    });

    const $wrap = $(".logo-wrap");
    const $glow = $(".bg-glow");

    $wrap.on("mousemove", function (e) {
      const offset = $wrap.offset();
      const x = e.pageX - offset.left;
      const y = e.pageY - offset.top;
      $glow.css({
        left: x + "px",
        top: y + "px",
        transform: "translate(-50%, -50%)",
      });
    });
  });

  // ================================
  // ANIMATION: readyReveal
  // ================================
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1200px)", () => {
    const readyGsap = gsap.timeline({
      scrollTrigger: {
        trigger: ".ready",
        start: "top top",
        end: "+=150%",
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    readyGsap.from(".ready-inner ", {
      scale: 0.7,
      duration: 0.5,
      opacity: 0.5,
    });
  });

  // ================================
  // ANIMATION: poolListHover
  // ================================
  $(".pool-list a").hover(
    function () {
      $(".pool-list a").removeClass("active");
      $(this).addClass("active");
    },
    function () {
      $(this).removeClass("active");
    },
  );

  // ================================
  // ANIMATION: heroParallax
  // ================================
  gsap.to(".hero-bg img", {
    scale: 1.25,
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // ================================
  // ANIMATION: bannerFadeOut
  // ================================
  gsap.to(".bnnr-inner", {
    opacity: 0,
    y: -120,
    filter: "blur(6px)",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // ================================
  // ANIMATION: headerScroll
  // ================================
  const header = document.querySelector(".main-header");

  let showAnim = gsap.to(header, {
    y: 0,
    opacity: 1,
    duration: 0.5,
    paused: true,
    ease: "power3.out",
  });

  let hideAnim = gsap.to(header, {
    y: 0,
    opacity: 1,
    duration: 0.4,
    paused: true,
    ease: "power2.in",
  });

  // hero sec
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => {
      if (self.progress > 0.05 && self.progress < 0.95) {
        hideAnim.play();
      } else {
        showAnim.play();
      }
    },
  });

  ScrollTrigger.create({
    trigger: ".hero",
    start: "bottom top",
    onEnter: () => {
      header.classList.add("fixed");
      showAnim.play();
    },
    onLeaveBack: () => {
      header.classList.remove("fixed");
      showAnim.play();
    },
  });

  // ================================
  // ANIMATION: textGlowReveal
  // ================================
  const textEl = document.querySelector(".glow-text");

  if (textEl) {
    const temp = document.createElement("div");
    temp.innerHTML = textEl.innerHTML;

    let finalHTML = "";

    temp.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        let words = node.textContent.trim().split(/\s+/);
        words.forEach((word) => {
          if (!word) return;
          let letters = word
            .split("")
            .map((char) => `<span class="char">${char}</span>`)
            .join("");
          finalHTML += `<span class="word">${letters}</span> `;
        });
      }

      if (node.nodeType === 1 && node.classList.contains("blue-color")) {
        let words = node.textContent.trim().split(/\s+/);
        let blueHTML = words
          .map((word) => {
            if (!word) return "";
            let letters = word
              .split("")
              .map((char) => `<span class="char is-blue">${char}</span>`)
              .join("");
            return `<span class="word">${letters}</span>`;
          })
          .join(" ");
        finalHTML += `<span class="blue-color">${blueHTML}</span>`;
      }
    });

    textEl.innerHTML = finalHTML.trim();

    const chars = document.querySelectorAll(".glow-text .char");

    ScrollTrigger.create({
      trigger: ".heading-single",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
      onUpdate: (self) => {
        let progress = self.progress * 1.8;
        let current = Math.floor(progress * chars.length);
        chars.forEach((char, i) => {
          if (i < current - 2) {
            char.classList.add("revealed");
            char.classList.remove("active");
          } else if (i >= current - 2 && i <= current + 2) {
            char.classList.add("active");
            char.classList.remove("revealed");
          } else {
            char.classList.remove("active", "revealed");
          }
        });
      },
    });
  }

  // ================================
  // ANIMATION: ctaMagneticHover
  // ================================
  const btn = document.querySelector(".cta");
  if (btn) {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
    });
  }

  // ================================
  // ANIMATION: mobilePoolAccordion
  // ================================
  const $parent = $(".max-767");

  $parent.on("click touchstart", ".pool-headings a", function (e) {
    e.preventDefault();
    const $this = $(this);
    if ($this.hasClass("active")) {
      $this.removeClass("active");
    } else {
      $parent.find(".pool-headings a").removeClass("active");
      $this.addClass("active");
    }
  });

  $(document).on("click touchstart", function (e) {
    if (!$(e.target).closest(".max-767").length) {
      $parent.find(".pool-headings a").removeClass("active");
    }
  });

  const reaveal = document.querySelector(".max-767");
  if (reaveal) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reaveal.classList.add("active");
            observer.unobserve(reaveal);
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(reaveal);
  }
  const track = document.querySelector(".moving-track");

  // duplicate content for seamless loop
  track.innerHTML += track.innerHTML;

  const totalWidth = track.scrollWidth / 2;

  gsap.to(track, {
    x: `-=${totalWidth}`,
    duration: 70, // control speed
    ease: "none", // IMPORTANT → constant smooth motion
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
    },
  });

  // pinned sec

  // ================================
  // REFRESH
  // ================================

  setTimeout(() => ScrollTrigger.refresh(), 200);
  $(window).on("resize", () => ScrollTrigger.refresh());
});

// main header animation for particular sections
const target_sections = document.querySelectorAll(
  ".customize-studio, .pool-wrap",
);
const header_new = document.querySelector(".main-header");

window.addEventListener("scroll", function () {
  if (!target_sections.length || !header_new) return;

  let hideHeader = false;

  target_sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= 0 && rect.bottom > 0) {
      hideHeader = true;
    }
  });

  if (hideHeader) {
    header_new.style.display = "none";
  } else {
    header_new.style.display = "block";
  }
});

// inner banner js canvs background
(function () {
  const canvases = document.querySelectorAll(".innerhero-canvas");

  canvases.forEach((canvas) => {
    const innerheroSection = canvas.closest(".innerCanvasSection");
    if (!canvas || !innerheroSection) return;

    const ctx = canvas.getContext("2d");

    let CELL = 90, DOT_RADIUS = 3.5;
    const DOT_COLOR = "180,180,180";
    let DASH_LEN = 14, DASH_GAP, LIT_RADIUS = 200;
    const BLOB_COLOR = "45,83,144";
    let BLOB_W = 18, BLOB_H = 2, BLOB_GLOW = 45, BLOB_SPEED = 3.0, SEG_COUNT = 18;
    const SEG_DURATION = [60, 140];

    function updateConfig(width) {
      if (width >= 1400) CELL = 110;
      else if (width >= 1000) CELL = 90;
      else if (width >= 768) CELL = 72;
      else if (width >= 548) CELL = 56;
      else CELL = 44;

      const scale = CELL / 90;
      DOT_RADIUS = Math.max(1.8, 3.5 * scale);
      DASH_LEN = Math.max(6, Math.round(14 * scale));
      DASH_GAP = Math.max(8, CELL - DASH_LEN * 2);
      LIT_RADIUS = Math.round(200 * scale);
      BLOB_W = Math.max(8, 18 * scale);
      BLOB_H = Math.max(1, 2 * scale);
      BLOB_GLOW = Math.max(12, Math.round(45 * scale));
      BLOB_SPEED = Math.max(1.2, 3.0 * scale);
      SEG_COUNT = width < 600 ? 8 : width < 1000 ? 12 : 18;
    }

    let W, H, xs = [], ys = [], dotPhases = {}, flashSegs = [];
    let rafId = null;
    let isVisible = false;

    // FIX 1: Pre-computed lit values cache — avoid recalculating sqrt every frame per dot
    let litCache = {};

    let blobV = { x: 0, y: 0, targetX: 0, targetY: 0, moving: "v", stepDir: 1, colI: 0 };
    let blobH = { x: 0, y: 0, targetX: 0, targetY: 0, moving: "h", stepDir: 1, rowI: 0 };

    function buildGrid() {
      xs = []; ys = [];
      for (let x = CELL; x < W; x += CELL) xs.push(x);
      for (let y = CELL; y < H; y += CELL) ys.push(y);

      dotPhases = {};
      for (const x of xs)
        for (const y of ys)
          dotPhases[`${x},${y}`] = Math.random() * Math.PI * 2;

      initFlashSegs();
    }

    function randomSeg() {
      const ttl = SEG_DURATION[0] + Math.floor(Math.random() * (SEG_DURATION[1] - SEG_DURATION[0]));
      return {
        xi: Math.floor(Math.random() * (xs.length - 1)),
        yi: Math.floor(Math.random() * (ys.length - 1)),
        dir: Math.random() > 0.5 ? "h" : "v",
        age: 0, ttl, alpha: 0,
      };
    }

    function initFlashSegs() {
      flashSegs = [];
      for (let i = 0; i < SEG_COUNT; i++) {
        const s = randomSeg();
        s.age = Math.floor(Math.random() * s.ttl);
        flashSegs.push(s);
      }
    }

    function updateFlashSegs() {
      for (const s of flashSegs) {
        s.age++;
        const p = s.age / s.ttl;
        s.alpha = p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1;
        if (s.age >= s.ttl) Object.assign(s, randomSeg());
      }
    }

    function pickTarget(blob) {
      if (blob.moving === "v") {
        let curYi = ys.indexOf(blob.y);
        let nextYi = curYi + blob.stepDir;
        if (nextYi >= ys.length || nextYi < 0) {
          let randomCol = Math.floor(Math.random() * xs.length);
          while (randomCol === blob.colI) randomCol = Math.floor(Math.random() * xs.length);
          blob.colI = randomCol;
          blob.x = blob.targetX = xs[blob.colI];
          blob.y = blob.targetY = ys[0];
          nextYi = 0;
        }
        blob.targetX = xs[blob.colI];
        blob.targetY = ys[nextYi];
      } else {
        let curXi = xs.indexOf(blob.x);
        let nextXi = curXi + blob.stepDir;
        if (nextXi >= xs.length || nextXi < 0) {
          let randomRow = Math.floor(Math.random() * ys.length);
          while (randomRow === blob.rowI) randomRow = Math.floor(Math.random() * ys.length);
          blob.rowI = randomRow;
          blob.x = blob.targetX = xs[0];
          blob.y = blob.targetY = ys[blob.rowI];
          nextXi = 0;
        }
        blob.targetX = xs[nextXi];
        blob.targetY = ys[blob.rowI];
      }
    }

    function initBlobs() {
      if (xs.length < 2 || ys.length < 2) return;
      blobV.colI = 0; blobV.stepDir = 1;
      blobV.x = blobV.targetX = xs[0];
      blobV.y = blobV.targetY = ys[0];
      pickTarget(blobV);

      blobH.rowI = ys.length - 1; blobH.stepDir = 1;
      blobH.x = blobH.targetX = xs[0];
      blobH.y = blobH.targetY = ys[ys.length - 1];
      pickTarget(blobH);
    }

    function moveBlob(blob) {
      const dx = blob.targetX - blob.x;
      const dy = blob.targetY - blob.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= BLOB_SPEED) {
        blob.x = blob.targetX;
        blob.y = blob.targetY;
        pickTarget(blob);
      } else {
        blob.x += (dx / dist) * BLOB_SPEED;
        blob.y += (dy / dist) * BLOB_SPEED;
      }
    }

    // FIX 2: Compute all lit values once per frame into a cache
    function buildLitCache() {
      litCache = {};
      const LR2 = LIT_RADIUS * LIT_RADIUS;
      for (const x of xs) {
        for (const y of ys) {
          const dvx = x - blobV.x, dvy = y - blobV.y;
          const dhx = x - blobH.x, dhy = y - blobH.y;
          const litV = Math.max(0, 1 - Math.sqrt(dvx * dvx + dvy * dvy) / LIT_RADIUS);
          const litH = Math.max(0, 1 - Math.sqrt(dhx * dhx + dhy * dhy) / LIT_RADIUS);
          litCache[`${x},${y}`] = Math.min(1, litV + litH);
        }
      }
    }

    function drawDots(time) {
      for (const x of xs) {
        for (const y of ys) {
          const phase = dotPhases[`${x},${y}`];
          const blink = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 0.002 + phase));
          const lit = litCache[`${x},${y}`] || 0;

          let r, g, b, a;
          if (lit > 0.05) {
            r = Math.round(237 - lit * (237 - 45));
            g = Math.round(237 - lit * (237 - 83));
            b = Math.round(237 - lit * (237 - 144));
            a = blink * (0.25 + lit * 0.3);
          } else {
            r = g = b = 180;
            a = 0.09;
          }

          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawShortDashes() {
      ctx.setLineDash([]);
      ctx.lineWidth = 1.0;

      for (let j = 0; j < ys.length; j++) {
        const y = ys[j];
        const lit = litCache[`${xs[0]},${y}`] || 0;
        ctx.strokeStyle = `rgba(237,237,237,${0.4 + lit * 0.15})`;
        ctx.beginPath();
        ctx.moveTo(xs[0], y);
        ctx.lineTo(xs[xs.length - 1], y);
        ctx.stroke();
      }

      for (let i = 0; i < xs.length; i++) {
        const x = xs[i];
        const lit = litCache[`${x},${ys[0]}`] || 0;
        ctx.strokeStyle = `rgba(237,237,237,${0.4 + lit * 0.15})`;
        ctx.beginPath();
        ctx.moveTo(x, ys[0]);
        ctx.lineTo(x, ys[ys.length - 1]);
        ctx.stroke();
      }
    }

    function drawFlashSegs() {
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      for (const s of flashSegs) {
        if (s.alpha <= 0.01 || s.xi >= xs.length - 1 || s.yi >= ys.length - 1) continue;
        ctx.strokeStyle = `rgba(180,180,180,${s.alpha * 0.13})`;
        ctx.beginPath();
        if (s.dir === "h") {
          ctx.moveTo(xs[s.xi], ys[s.yi]);
          ctx.lineTo(xs[s.xi + 1], ys[s.yi]);
        } else {
          ctx.moveTo(xs[s.xi], ys[s.yi]);
          ctx.lineTo(xs[s.xi], ys[s.yi + 1]);
        }
        ctx.stroke();
      }
    }

    // FIX 3: Pre-render blob glow onto an offscreen canvas — no blur on every frame
    let blobGlowCache = null;

    function buildBlobGlowCache() {
      const size = BLOB_GLOW * 2 + 4;
      blobGlowCache = document.createElement("canvas");
      blobGlowCache.width = size;
      blobGlowCache.height = size;
      const gc = blobGlowCache.getContext("2d");
      const cx = size / 2, cy = size / 2;
      const glow = gc.createRadialGradient(cx, cy, 0, cx, cy, BLOB_GLOW);
      glow.addColorStop(0, `rgba(${BLOB_COLOR}, 0.28)`);
      glow.addColorStop(0.5, `rgba(${BLOB_COLOR}, 0.10)`);
      glow.addColorStop(1, `rgba(${BLOB_COLOR}, 0)`);
      gc.filter = "blur(8px)";
      gc.fillStyle = glow;
      gc.beginPath();
      gc.arc(cx, cy, BLOB_GLOW, 0, Math.PI * 2);
      gc.fill();
    }

    function drawSingleBlob(blob) {
      // Draw pre-rendered glow (no live blur)
      if (blobGlowCache) {
        const size = blobGlowCache.width;
        ctx.drawImage(blobGlowCache, blob.x - size / 2, blob.y - size / 2);
      }

      // Draw blob body
      ctx.save();
      ctx.translate(blob.x, blob.y);
      if (blob.moving === "v") ctx.rotate(Math.PI / 2);
      ctx.fillStyle = `rgba(${BLOB_COLOR},1)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, BLOB_W / 2, BLOB_H / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function draw(time) {
      ctx.clearRect(0, 0, W, H);
      updateFlashSegs();
      buildLitCache();       // FIX 2: one-time lit calc per frame
      drawShortDashes();
      drawFlashSegs();
      drawDots(time);
      drawSingleBlob(blobV);
      drawSingleBlob(blobH);
      moveBlob(blobV);
      moveBlob(blobH);

      rafId = requestAnimationFrame(draw);
    }

    // FIX 1: Pause when off-screen
    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(draw);
    }

    function stopLoop() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        isVisible = e.isIntersecting;
        isVisible ? startLoop() : stopLoop();
      });
    }, { threshold: 0.01 });

    function resize() {
      W = canvas.width = innerheroSection.offsetWidth;
      H = canvas.height = innerheroSection.offsetHeight;
      updateConfig(W);
      buildGrid();
      initBlobs();
      buildBlobGlowCache(); // FIX 3: rebuild on resize
    }

    function init() {
      resize();
      window.addEventListener("resize", resize);
      observer.observe(innerheroSection); // FIX 1: start/stop with visibility
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  });
})();
// ================================
// ANIMATION: loaderBookOpen
// ================================
// Immediate loader animation
(function () {
  const loader = document.querySelector(".loader");

  if (loader) {
    document.body.classList.add("no-scroll");

    // Wait for Lenis to be available
    const checkLenis = setInterval(() => {
      if (typeof lenis !== "undefined") {
        clearInterval(checkLenis);
        lenis.stop();
      }
    }, 50);

    const loaderTl = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 1.4 },
      onComplete: () => {
        loader.style.display = "none";
        document.body.classList.remove("no-scroll");
        if (typeof lenis !== "undefined") {
          lenis.start();
        }
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      },
    });

    gsap.set(".upper-div", { y: 0 });
    gsap.set(".lower-div", { y: 0 });

    loaderTl
      .to(".upper-div", { y: "-100%", duration: 3 })
      .to(".lower-div", { y: "100%", duration: 3 }, 0)
      .to(".loader", { opacity: 0, duration: 0.5 }, "-=0.6");
  }
})();
