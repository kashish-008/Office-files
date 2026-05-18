// script.js
gsap.registerPlugin(ScrollTrigger);

// ── 1. Hero parallax (kept on all devices) ──
const heroSection = document.querySelector(".home-hero");
const heroContent = document.querySelector(".home-hero .hero-content");

if (heroSection && heroContent) {
  gsap.to(heroContent, {
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      markers: false,
    },
    y: 100,
    ease: "sine.out",
  });

  // Blur effect on background via CSS variable
  gsap.to(heroSection, {
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      markers: false,
    },
    "--bg-blur": "5px",
    ease: "sine.out",
  });
}

// ── Media query for desktop-only animations ──
const desktopMq = window.matchMedia("(min-width: 1025px)");

// ── 2. Modern image expand (desktop only) ──
let modernTimeline = null;

function initModernAnim() {
  if (modernTimeline) return;
  const i = document.querySelector(".modern-img-wrap");
  const t = document.querySelector(".modern-text");
  if (!i || !t) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  modernTimeline = gsap
    .timeline({
      scrollTrigger: {
        trigger: ".modern",
        start: "top bottom",
        end: "+=300vh",
        scrub: 0.6,
        pin: false,
        onLeave: () =>
          gsap.to(t, { opacity: 1, duration: 0.8, ease: "power2.out" }),
        onEnterBack: () =>
          gsap.to(t, { opacity: 0, duration: 0.3 }),
      },
    })
    .to(i, {
      width: w,
      height: h,
      borderRadius: 0,
      ease: "none",
    });
}

function killModernAnim() {
  if (modernTimeline) {
    modernTimeline.kill();
    modernTimeline = null;
  }
  // reset inline styles (optional)
  const i = document.querySelector(".modern-img-wrap");
  const t = document.querySelector(".modern-text");
  if (i) gsap.set(i, { clearProps: "all" });
  if (t) gsap.set(t, { clearProps: "all" });
}

// ── 3. Your‑pool step swap (desktop only) ──
let stepScrollTrigger = null;

function initStepSwap() {
  const s = document.getElementById("yourPool"),
    w = document.querySelectorAll(".choose-wrap");
  if (!s || !w.length) return;

  const t = w.length,
    p = 500,
    d = p * (t - 1);
  let c = 0,
    a = false;

  gsap.set(w, { position: "absolute", top: 0, left: 0, width: "100%" });
  gsap.set(w[0], { autoAlpha: 1 });
  for (let i = 1; i < w.length; i++) gsap.set(w[i], { autoAlpha: 0 });

  function goTo(n) {
    if (n === c || a || n < 0 || n >= t) return;
    a = true;
    gsap.to(w[c], {
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(w[n], {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => (a = false),
        });
      },
    });
    c = n;
  }

  stepScrollTrigger = ScrollTrigger.create({
    trigger: s,
    start: "top top",
    end: `+=${d}`,
    pin: true,
    pinSpacing: true,
    onUpdate: (e) => {
      goTo(Math.round(e.progress * (t - 1)));
    },
  });
}

function killStepSwap() {
  if (stepScrollTrigger) {
    stepScrollTrigger.kill();
    stepScrollTrigger = null;
  }
  // Reset inline styles to CSS defaults
  const wraps = document.querySelectorAll(".choose-wrap");
  wraps.forEach((wrap) => gsap.set(wrap, { clearProps: "all" }));
}

// ── 4. Trusted grid plus signs (runs everywhere) ──
(function () {
  const g = document.querySelector(".trusted-grid"),
    p = document.querySelector(".plus-grid");
  if (!g || !p) return;

  function place() {
    p.innerHTML = "";
    const r = p.parentElement.getBoundingClientRect(),
      c = [...g.querySelectorAll(".grid-cell")].slice(5, 10),
      t = c[0].getBoundingClientRect().top - r.top,
      b = c[0].getBoundingClientRect().bottom - r.top,
      x = c.map((e) => e.getBoundingClientRect().left - r.left);
    x.push(c[c.length - 1].getBoundingClientRect().right - r.left);

    [t, b].forEach((y) =>
      x.slice(1, -1).forEach((x) => {
        const d = document.createElement("div");
        d.className = "plus-sign";
        d.style.left = x + "px";
        d.style.top = y + "px";
        d.innerHTML = '<img src="assets/+.svg" alt="+">';
        p.appendChild(d);
      })
    );
  }

  window.addEventListener("load", place);
  window.addEventListener("resize", place);
})();

// ── 5. Desktop/mobile switch ──
function handleDesktopChange(e) {
  if (e.matches) {
    initModernAnim();
    initStepSwap();
  } else {
    killModernAnim();
    killStepSwap();
  }
}

// Initial run
if (desktopMq.matches) {
  initModernAnim();
  initStepSwap();
} else {
  killModernAnim();
  killStepSwap();
}

// Listen for breakpoint changes
desktopMq.addEventListener("change", handleDesktopChange);

// Refresh ScrollTrigger on resize (only when modern animation active)
window.addEventListener("resize", () => {
  if (modernTimeline) ScrollTrigger.refresh();
});