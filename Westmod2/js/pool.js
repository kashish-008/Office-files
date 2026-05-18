// pool.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".engineer-pool");
  if (!container) return;

  const poolImg = container.querySelector(".pool-img img");
  const layerImages = Array.from(container.querySelectorAll(".pool-part img"));
  if (!poolImg || !layerImages.length) return;

  const textLabels = new Map();
  container.querySelectorAll(".pp-img").forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    const text = wrapper.querySelector("p");
    if (img && text && layerImages.includes(img)) {
      textLabels.set(layerImages.indexOf(img), text);
    }
  });

  // ── Helpers ──
  const hideElement = (el) =>
    gsap.set(el, { opacity: 0, pointerEvents: "none", display: "none" });
  const showElement = (el, props = {}) =>
    gsap.set(el, { display: "block", ...props });

  // ── Media query ──
  const desktopMQ = window.matchMedia("(min-width: 1025px)");
  let scrollTriggerInstance = null;

  function initPoolAnimation() {
    if (scrollTriggerInstance) return; // already set up

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const textOffsets = { 1: -150, 3: -50, 5: 150 };
    const animationDelay = 0.55;
    const animationGap = 0.05;

    gsap.registerPlugin(ScrollTrigger);

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: "top 50%",
      end: "center center",
      scrub: true,

      onUpdate(self) {
        if (self.progress >= 1) return;

        const opacity = gsap.utils.clamp(0, 1, 1 - self.progress * 2);
        gsap.set(poolImg, {
          opacity,
          scale: 1 - (1 - opacity) * 0.02,
          y: -20 * (1 - opacity),
        });

        layerImages.forEach((layer, index) => {
          const layerProgress = gsap.utils.clamp(
            0,
            1,
            (self.progress - animationDelay - index * animationGap) /
              animationGap,
          );
          const hasStarted = layerProgress > 0;
          const isComplete = layerProgress >= 1;

          layer.classList.toggle("show", hasStarted);
          if (hasStarted) {
            showElement(layer, {
              position: "fixed",
              left: centerX,
              top: centerY,
              xPercent: -50,
              yPercent: -50,
              y: index,
              scale: 0.6 + 0.4 * layerProgress,
              opacity: isComplete ? 1 : layerProgress,
              zIndex: 1100 - index,
            });
            if (textLabels.has(index)) {
              const textLabel = textLabels.get(index);
              textLabel.classList.add("show");
              showElement(textLabel, {
                position: "fixed",
                top: centerY + (textOffsets[index] ?? 0),
                opacity: isComplete ? 1 : layerProgress,
                zIndex: 1099,
              });
            }
          } else {
            hideElement(layer);
            textLabels.get(index) && hideElement(textLabels.get(index));
          }
        });
      },
    });
  }

  function destroyPoolAnimation() {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
    // Reset any inline styles set by GSAP – remove fixed positions, opacity, etc.
    gsap.set(poolImg, { clearProps: "all" });
    layerImages.forEach((layer, index) => {
      gsap.set(layer, { clearProps: "all" });
      layer.classList.remove("show");
      const textLabel = textLabels.get(index);
      if (textLabel) {
        gsap.set(textLabel, { clearProps: "all" });
        textLabel.classList.remove("show");
      }
    });
  }

  // ── Initial run ──
  if (desktopMQ.matches) {
    initPoolAnimation();
  }

  // ── Listen for breakpoint changes ──
  desktopMQ.addEventListener("change", (e) => {
    if (e.matches) {
      initPoolAnimation();
    } else {
      destroyPoolAnimation();
    }
  });

  // Keep ScrollTrigger updated on window resize (only if active)
  window.addEventListener("resize", () => {
    if (scrollTriggerInstance) {
      ScrollTrigger.refresh();
    }
  });
});