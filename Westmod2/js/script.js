gsap.registerPlugin(ScrollTrigger);
const i = document.querySelector(".modern-img-wrap"),
  t = document.querySelector(".modern-text"),
  w = window.innerWidth,
  h = window.innerHeight;
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".modern",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      pin: !1,
      onLeave: () =>
        gsap.to(t, { opacity: 1, duration: 0.8, ease: "power2.out" }),
      onEnterBack: () => gsap.to(t, { opacity: 0, duration: 0.3 }),
    },
  })
  .to(i, { width: w, height: h, borderRadius: 0, ease: "none" });

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
      }),
    );
  }
  window.addEventListener("load", place);
  window.addEventListener("resize", place);
})();

(function () {
  const s = document.getElementById("yourPool"),
    w = document.querySelectorAll(".choose-wrap");
  if (!s || !w.length) return;
  const t = w.length,
    p = 500,
    d = p * (t - 1);
  let c = 0,
    a = !1;
  gsap.set(w[0], { autoAlpha: 1 });
  gsap.set(w, { position: "absolute", top: 0, left: 0, width: "100%" });
  function g(n) {
    if (n === c || a || n < 0 || n >= t) return;
    a = !0;
    const o = w[c],
      i = w[n];
    gsap.to(o, {
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(i, {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            a = !1;
          },
        });
      },
    });
    c = n;
  }
  ScrollTrigger.create({
    trigger: s,
    start: "top top",
    end: `+=${d}`,
    pin: !0,
    pinSpacing: !0,
    onUpdate: (e) => {
      g(Math.round(e.progress * (t - 1)));
    },
  });
})();
