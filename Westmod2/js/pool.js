document.addEventListener("DOMContentLoaded", () => {
  // Get all needed elements
  const container = document.querySelector(".engineer-pool");
  if (!container) return;

  const poolImgWrap = container.querySelector(".pool-img");
  const poolImg = poolImgWrap?.querySelector("img");
  const layerImages = Array.from(container.querySelectorAll(".pool-part img"));

  if (!poolImg || !layerImages.length) return;

  // Create a map of image index to text label
  const textLabels = new Map();
  container.querySelectorAll(".pp-img").forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    const text = wrapper.querySelector("p");
    if (img && text) {
      const index = layerImages.indexOf(img);
      if (index !== -1) textLabels.set(index, text);
    }
  });

  // Setup positions and animation settings
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const textOffsets = { 1: -150, 3: -50, 5: 150 };
  const animationDelay = 0.55;
  const animationGap = 0.05;

  // Register GSAP plugin and create ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: container,
    start: "top 50%",
    end: "bottom bottom",
    scrub: true,

    onUpdate(self) {
      const progress = self.progress;

      // Fade out main pool image
      const opacity = gsap.utils.clamp(0, 1, 1 - progress * 2 );
      gsap.set(poolImg, {
        opacity: opacity,
        scale: 1 - (1 - opacity) * 0.02,
        y: -20 * (1 - opacity),
      });
      // poolImgWrap.classList.toggle("fade-out", progress > 0.05);

      // Animate each layer
      layerImages.forEach((layer, index) => {
        const startPoint = animationDelay + index * animationGap;
        const layerProgress = gsap.utils.clamp(
          0,
          1,
          (progress - startPoint) / animationGap,
        );
        const isVisible = layerProgress > 0 && progress < 1;

        if (isVisible) {
          layer.classList.add("show");
          gsap.set(layer, {
            position: "fixed",
            left: centerX,
            top: centerY,
            xPercent: -50,
            yPercent: -50,
            y: index * 1,
            scale: 0.6 + 0.4 * layerProgress,
            opacity: layerProgress,
            zIndex: 1100 - index,
          });

          // Show text label
          if (textLabels.has(index)) {
            const textLabel = textLabels.get(index);
            const offsetY = textOffsets[index] ?? 0;
            textLabel.classList.add("show");
            gsap.set(textLabel, {
              position: "fixed",
              top: centerY + offsetY,
              opacity: layerProgress,
              zIndex: 1099,
            });
          }
        } else {
          layer.classList.remove("show");
          gsap.set(layer, { opacity: 0, pointerEvents: "none" });

          if (textLabels.has(index)) {
            const textLabel = textLabels.get(index);
            textLabel.classList.remove("show");
            gsap.set(textLabel, { opacity: 0, pointerEvents: "none" });
          }
        }
      });
    },
  });

  // Update on window resize
  window.addEventListener("resize", () => ScrollTrigger.refresh());
});
