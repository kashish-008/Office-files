document.addEventListener("DOMContentLoaded", () => {
  // Get main container and images
  const container = document.querySelector(".engineer-pool");
  if (!container) return;

  const poolImgWrap = container.querySelector(".pool-img");
  const poolImg = poolImgWrap?.querySelector("img") ?? null;
  const parts = Array.from(container.querySelectorAll(".pool-part img"));
  if (!poolImg || !parts.length) return;

  // Create a map linking each image to its text label
  const textMap = new Map();
  Array.from(container.querySelectorAll(".pp-img")).forEach((el) => {
    const img = el.querySelector("img");
    const text = el.querySelector("p");
    if (img && text) {
      const index = parts.indexOf(img);
      if (index !== -1) textMap.set(index, text);
    }
  });

  // Helper function to limit a value between min and max
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  // Animation settings
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const startDelay = 0.35; // When layers start revealing
  const layerGap = 0.05; // Time gap between each layer

  let animationFrame = null;

  function update() {
    // Calculate scroll progress (0 to 1)
    const rect = container.getBoundingClientRect();
    const progress = clamp(
      (window.innerHeight * 0.5 - rect.top) / (rect.height || 1),
      0,
      1,
    );

    // Fade out main pool image
    const mainOpacity = clamp(1 - progress * 3, 0, 1);
    poolImg.style.opacity = mainOpacity;
    poolImg.style.transform = `scale(${1 - (1 - mainOpacity) * 0.02}) translateY(${-20 * (1 - mainOpacity)}px)`;
    poolImgWrap.classList.toggle("fade-out", progress > 0.05);

    // Animate each layer
    parts.forEach((layer, i) => {
      const revealStart = startDelay + i * layerGap;
      const layerProgress = clamp((progress - revealStart) / layerGap, 0, 1);
      const isVisible = layerProgress > 0 && progress < 1;

      if (isVisible) {
        layer.classList.add("show");
        layer.style.position = "fixed";
        layer.style.left = `${centerX}px`;
        layer.style.top = `${centerY}px`;
        layer.style.transform = `translate(-50%, calc(-50% + ${i * 8}px)) scale(${0.6 + 0.4 * layerProgress})`;
        layer.style.opacity = layerProgress;
        layer.style.zIndex = 1100 - i;

        // Animate text label if it exists
        if (textMap.has(i)) {
          const text = textMap.get(i);
          text.classList.add("show");
          text.style.position = "fixed";
          text.style.left = `${centerX - 360}px`;

          // Set different vertical positions for specific text
          const textPositions = { 0: -10, 3: 0, 5: 150 };
          text.style.top = `${centerY + (textPositions[i] || 0)}px`;

          text.style.transform = `translate(0, -50%) scale(${0.6 + 0.4 * layerProgress})`;
          text.style.opacity = layerProgress;
          text.style.zIndex = 1099;
        }
      } else {
        layer.classList.remove("show");
        layer.style.opacity = "0";
        layer.style.pointerEvents = "none";

        // Hide text label if it exists
        if (textMap.has(i)) {
          const text = textMap.get(i);
          text.classList.remove("show");
          text.style.opacity = "0";
          text.style.pointerEvents = "none";
        }
      }
    });

    animationFrame = null;
  }

  // Scroll and resize event handler
  const onScroll = () => {
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update(); // Initial call
});
