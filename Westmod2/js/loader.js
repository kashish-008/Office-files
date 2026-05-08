document.addEventListener("DOMContentLoaded", () => {
  const loaderContent = document.getElementById("loaderContent");
  const loaderFill = document.getElementById("loaderFill");
  const loaderDot = document.getElementById("loaderDot");
  const loaderBlob = document.getElementById("loaderBlob");

  // progress object for gsap to tween
  const progressObj = { value: 0 };

  // step 1 — logo + bar fade in
  gsap.to(loaderContent, {
    opacity: 1,
    scale: 1,
    duration: 0.9,
    ease: "power2.out",
    delay: 0.3,
    onComplete: startProgress,
  });

  // step 2 — gsap animates progress value 0 to 100
  function startProgress() {
    gsap.to(loaderFill, {
      width: "100%",
      duration: 2.2,
      ease: "none",
      onUpdate: function () {
        // sync dot position with fill width
        const fillWidth = loaderFill.getBoundingClientRect().width;
        const trackWidth =
          loaderFill.parentElement.getBoundingClientRect().width;
        const percent = (fillWidth / trackWidth) * 100;
        loaderDot.style.left = percent + "%";
      },
      onComplete: () => {
        setTimeout(exitLoader, 350);
      },
    });
  }

  // update bar fill + dot position on every gsap tick
  function updateBar() {
    const p = progressObj.value;
    loaderFill.style.width = p + "%";
    loaderDot.style.left = p + "%";
  }

  // step 3 — logo fades out
  function exitLoader() {
    gsap.to(loaderContent, {
      opacity: 0,
      y: -10,
      duration: 0.35,
      ease: "power1.out",
      onComplete: blobExpand,
    });
  }

  // step 4 — blob expands fast from center
  function blobExpand() {
    // Glassy morph: subtle pop → large radial-gradient expand → gentle settle
    const tl = gsap.timeline({ onComplete: blobWipeAway });

    // quick soft pop for impact
    tl.to(loaderBlob, {
      scale: 5,
      duration: 0.12,
      ease: "power2.out",
      transformOrigin: "50% 50%",
    });

    // large glassy expand with radial gradient, blur, and subtle rotate
    tl.to(
      loaderBlob,
      {
        scale: 36,
        duration: 0.48,
        ease: "power2.in",
        rotate: 6,
        borderRadius: "45% 55% 50% 50% / 50% 45% 55% 50%",
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 8%, rgba(45,83,144,0.95) 60%)",
        boxShadow:
          "0 30px 80px rgba(45,83,144,0.28), inset 0 2px 12px rgba(255,255,255,0.06)",
        filter: "blur(8px) saturate(120%)",
        transformOrigin: "50% 50%",
      },
      "-=0.06",
    );

    // gentle settle with a soft pulse to feel alive
    tl.to(
      loaderBlob,
      {
        scale: 34,
        rotate: -4,
        duration: 0.18,
        ease: "power1.out",
        borderRadius: "50% 50% 45% 55% / 55% 50% 45% 50%",
      },
      "+=0",
    );

    // tiny bounce/pulse
    tl.to(
      loaderBlob,
      { scale: 35, duration: 0.12, ease: "sine.inOut", yoyo: true, repeat: 1 },
      "+=0",
    );
  }

  // step 5 — blob wipes up quickly
  function blobWipeAway() {
    // overlap blob wipe with page fade so content appears without gap
    const tl = gsap.timeline({ onComplete: revealPage });

    tl.to(
      loaderBlob,
      {
        yPercent: -120,
        duration: 0.6,
        ease: "power3.inOut",
      },
      0,
    );

    // start fading page in during the wipe (reduces visual gap)
    tl.to(
      "body",
      {
        opacity: 1,
        duration: 0.45,
        ease: "power1.out",
      },
      0,
    );
  }

  // step 6 — hide loader, show page
  function revealPage() {
    // small delay so the page content settles before the loader is removed
    // adjust the delay (seconds) if you want it longer/shorter
    gsap.delayedCall(0.35, () => {
      gsap.set("#loader", { display: "none" });
    });
  }
});
