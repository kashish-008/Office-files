// ====== Counter Up ======
function countUp(el, target, duration) {
  let start = 0;
  const suffix = el.dataset.suffix || ""; // gets +, K+, % etc.
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;

    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

// Only start counting when stats section is visible
const statsSection = document.querySelector(".stats");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".stats-info h2").forEach((el) => {
          const target = parseInt(el.dataset.target);
          countUp(el, target, 2000);
        });
        observer.unobserve(statsSection); //  count only once
      }
    });
  },
  { threshold: 0.3 },
);

observer.observe(statsSection);
