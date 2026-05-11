gsap.registerPlugin(ScrollTrigger);

const imgWrap = document.querySelector(".modern-img-wrap");
const modernText = document.querySelector(".modern-text");

// final size — full viewport width, proper height
const finalW = window.innerWidth;
const finalH = window.innerHeight;

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".modern",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5, // slow, cinematic feel
      pin: false, // sticky handles pinning via CSS
      onLeave: () => {
        // text fades in when animation is fully done
        gsap.to(modernText, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      },
      onEnterBack: () => {
        gsap.to(modernText, {
          opacity: 0,
          duration: 0.3,
        });
      },
    },
  })
  .to(imgWrap, {
    width: finalW,
    height: finalH,
    borderRadius: 0,
    ease: "none",
  });

(function () {
  const grid = document.querySelector(".trusted-grid");
  const plusGrid = document.querySelector(".plus-grid");
  if (!grid || !plusGrid) return;

  function placePlusSigns() {
    plusGrid.innerHTML = "";

    const cols = 5;
    const gridRect = grid.getBoundingClientRect();
    const wrapRect = plusGrid.parentElement.getBoundingClientRect();

    // get middle row cells — cells 5 to 9 (index based)
    const cells = grid.querySelectorAll(".grid-cell");
    const middleRow = Array.from(cells).slice(5, 10); // 5 cols in middle row

    // top of middle row
    const topY = middleRow[0].getBoundingClientRect().top - wrapRect.top;
    // bottom of middle row
    const botY = middleRow[0].getBoundingClientRect().bottom - wrapRect.top;

    // x positions — each cell's left edge + last cell's right edge
    const xPositions = [];
    middleRow.forEach((cell) => {
      const r = cell.getBoundingClientRect();
      xPositions.push(r.left - wrapRect.left);
    });
    // add right edge of last cell
    const lastCell = middleRow[middleRow.length - 1].getBoundingClientRect();
    xPositions.push(lastCell.right - wrapRect.left);

    // place plus at top and bottom of each x intersection
    [topY, botY].forEach((y) => {
      xPositions.slice(1, -1).forEach((x) => {
        // 👈 slice(1, -1) removes first and last
        const plus = document.createElement("div");
        plus.className = "plus-sign";
        plus.style.left = `${x}px`;
        plus.style.top = `${y}px`;
        plus.innerHTML = `<img src="assets/+.svg" alt="+">`;
        plusGrid.appendChild(plus);
      });
    });
  }

  // wait for layout to settle then place
  window.addEventListener("load", placePlusSigns);
  window.addEventListener("resize", placePlusSigns);
})();
