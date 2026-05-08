document.addEventListener("DOMContentLoaded", () => {
  const loaderContent = document.getElementById("loaderContent");
  const loaderFill = document.getElementById("loaderFill");
  const loaderDot = document.getElementById("loaderDot");
  const loaderBlob = document.getElementById("loaderBlob");

  // single concise timeline: fade in → progress → hide content → blob wipe + body fade → remove loader
  const tl = gsap.timeline({ delay: 0.3 });

  tl.to(loaderContent, {
    opacity: 1,
    scale: 1,
    duration: 0.9,
    ease: "power2.out",
  })
    .to(loaderFill, {
      width: "100%",
      duration: 2.2,
      ease: "none",
      onUpdate() {
        const fillWidth = loaderFill.getBoundingClientRect().width;
        const trackWidth =
          loaderFill.parentElement.getBoundingClientRect().width;
        loaderDot.style.left = (fillWidth / trackWidth) * 100 + "%";
      },
    })
    .to(loaderContent, {
      opacity: 0,
      y: -10,
      duration: 0.35,
      ease: "power1.out",
    })
    .to(
      loaderBlob,
      { yPercent: -120, duration: 0.6, ease: "power3.inOut" },
      ">-0.0",
    )
    .to("body", { opacity: 1, duration: 0.45, ease: "power1.out" }, "<")
    .add(() =>
      gsap.delayedCall(0.35, () => gsap.set("#loader", { display: "none" })),
    );
});
