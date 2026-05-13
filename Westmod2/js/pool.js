document.addEventListener("DOMContentLoaded", function () {
  const engineerSection = document.querySelector(".engineer");
  const container = document.querySelector(".engineer-pool");
  const footer = document.querySelector(".site-footer");
  if (!container) return;

  const poolImgWrap = container.querySelector(".pool-img");
  const poolImg = poolImgWrap ? poolImgWrap.querySelector("img") : null;
  const parts = Array.from(container.querySelectorAll(".pool-part img"));
  if (!poolImg || parts.length === 0) return;

  // init footer - no fade effect
  if (footer) {
    footer.style.opacity = "1";
  }

  let ticking = false;

  function clamp(v, a, b) {
    return Math.min(b, Math.max(a, v));
  }

  function update() {
    ticking = false;
    const rect = container.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = clamp((vh * 0.5 - rect.top) / (rect.height || 1), 0, 1);

    // fade main image out faster (complete by progress ~0.3-0.4)
    const imgOpacity = clamp(1 - progress * 3, 0, 1);
    poolImg.style.opacity = imgOpacity;
    poolImg.style.transform = `scale(${1 - (1 - imgOpacity) * 0.02}) translateY(${-20 * (1 - imgOpacity)}px)`;

    if (progress > 0.05) poolImgWrap.classList.add("fade-out");
    else poolImgWrap.classList.remove("fade-out");

    // reveal pool parts ONLY after main image is fully invisible
    const partsStartProgress = 0.35;
    const n = parts.length;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    let allPartsVisible = false;
    parts.forEach((p, i) => {
      const localProgress = clamp(
        (progress - partsStartProgress) / (1 - partsStartProgress),
        0,
        1,
      );
      const start = i * 0.08;
      const duration = 0.5;
      const local = clamp((localProgress - start) / duration, 0, 1);

      // show images only while in engineer-pool section (progress < 1.0)
      if (local > 0 && progress < 1.0) {
        p.classList.add("show");
        p.style.position = "fixed";
        p.style.left = `${centerX}px`;
        p.style.top = `${centerY}px`;
        const yOffset = i * 8;
        p.style.transform = `translate(-50%, calc(-50% + ${yOffset}px)) scale(${0.95 + 0.05 * local})`;
        p.style.opacity = `${local}`;
        p.style.zIndex = `${1100 - i}`;

        // mark all visible once last image is at 90%+ opacity
        if (i === n - 1 && local > 0.9) allPartsVisible = true;
      } else {
        // hide images when scrolling past engineer-pool section
        p.classList.remove("show");
        p.style.opacity = "0";
        p.style.pointerEvents = "none";
      }
    });
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
});
