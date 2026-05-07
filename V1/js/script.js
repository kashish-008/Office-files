// const lenis = new Lenis({
//   duration: 1.2,
//   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//   smoothWheel: true,
//   smoothTouch: false,
//   normalizeWheel: true,
//   wheelMultiplier: 0.8,
// });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

AOS.init({
  duration: 700,
  easing: "ease-out",
  once: false,
  offset: 60,
});

window.addEventListener("load", () => {
  AOS.refreshHard();
});

// Video Player Functionality
const videoContainer = document.getElementById("videoContainer");
const closeVideoBtn = document.getElementById("closeVideoBtn");
const clickableVideos = document.querySelectorAll(".clickable-video");

clickableVideos.forEach((video) => {
  video.addEventListener("click", () => {
    videoContainer.classList.add("active");
  });
});

closeVideoBtn.addEventListener("click", () => {
  videoContainer.classList.remove("active");
});

// Close video when clicking outside the iframe area
videoContainer.addEventListener("click", (e) => {
  if (e.target === videoContainer) {
    videoContainer.classList.remove("active");
  }
});

// Close video with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && videoContainer.classList.contains("active")) {
    videoContainer.classList.remove("active");
  }
});
 