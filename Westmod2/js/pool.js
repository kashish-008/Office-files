document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".engineer-pool");
  if (!container) return;

  const poolImgWrap = container.querySelector(".pool-img");
  const poolImg = poolImgWrap?.querySelector("img") ?? null;
  const parts = Array.from(container.querySelectorAll(".pool-part img"));
  if (!poolImg || parts.length === 0) return;

  // Get all pp-img containers with their p tags
  const ppImgContainers = Array.from(container.querySelectorAll(".pp-img"));
  const ppImgMap = new Map();
  ppImgContainers.forEach((container) => {
    const img = container.querySelector("img");
    const p = container.querySelector("p");
    if (img && p) {
      const imgIndex = parts.indexOf(img);
      if (imgIndex !== -1) {
        ppImgMap.set(imgIndex, p);
      }
    }
  });

  let ticking = false;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function update() {
    ticking = false;
    const rect = container.getBoundingClientRect();
    const progress = clamp(
      (window.innerHeight * 0.5 - rect.top) / (rect.height || 1),
      0,
      1,
    );

    const imgOpacity = clamp(1 - progress * 3, 0, 1);
    poolImg.style.opacity = imgOpacity;
    poolImg.style.transform = `scale(${1 - (1 - imgOpacity) * 0.02}) translateY(${-20 * (1 - imgOpacity)}px)`;
    poolImgWrap.classList.toggle("fade-out", progress > 0.05);

    const partsStart = 0.35;
    const n = parts.length;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const revealInterval = 0.05; // gap between each image reveal

    for (let i = 0; i < n; i++) {
      const p = parts[i];
      // each image reveals at a different scroll threshold
      const revealThreshold = partsStart + i * revealInterval;
      const local = clamp((progress - revealThreshold) / 0.05, 0, 1);

      if (local > 0 && progress < 1.0) {
        p.classList.add("show");
        p.style.position = "fixed";
        p.style.left = `${centerX}px`;
        p.style.top = `${centerY}px`;
        // scale from 0.6 to 1 as user scrolls
        p.style.transform = `translate(-50%, calc(-50% + ${i * 8}px)) scale(${0.6 + 0.4 * local})`;
        p.style.opacity = `${local}`;
        p.style.zIndex = `${1100 - i}`;

        // If this image has an associated p tag, animate it to the left
        if (ppImgMap.has(i)) {
          const ppText = ppImgMap.get(i);
          ppText.classList.add("show");
          ppText.style.position = "fixed";
          ppText.style.left = `${centerX - 360}px`; // 360px to the left of the image

          // Different vertical positions for each text
          let textTop = centerY;
          if (i === 0)
            textTop = centerY - 10; // Pool-1 text (top position)
          else if (i === 3)
            textTop = centerY; // Pool-4 text (middle position)
          else if (i === 5) textTop = centerY + 150; // Pool-6 text (bottom position)

          ppText.style.top = `${textTop}px`;
          ppText.style.transform = `translate(0, -50%) scale(${0.6 + 0.4 * local})`; // Scale with image
          ppText.style.opacity = `${local}`;
          ppText.style.zIndex = `${1099}`;
        }
      } else {
        p.classList.remove("show");
        p.style.opacity = "0";
        p.style.pointerEvents = "none";

        // Reset p tag if it has one
        if (ppImgMap.has(i)) {
          const ppText = ppImgMap.get(i);
          ppText.classList.remove("show");
          ppText.style.opacity = "0";
          ppText.style.pointerEvents = "none";
        }
      }
    }
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
});
