// $(window).on("scroll", function () {
//   if ($(this).scrollTop() > 50) {
//     $("header").addClass("scrolled");
//   } else {
//     $("header").removeClass("scrolled");
//   }
// });

// banner-slider
$(document).ready(function () {
  var $slider = $(".pri-slider");
  var totalSlides = $slider.children().length;

  // Set total slides
  $(".slide-num p").html("<span>1</span>/" + totalSlides);

  $slider.on("init reInit afterChange", function (event, slick, currentSlide) {
    var i = (currentSlide ? currentSlide : 0) + 1;
    $(".slide-num span").text(i); // 🔥 FIX: always re-select
  });

  $slider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: false,
    fade: true,
    speed: 600,
  });
});

$(".scroll-indicator").on("click", function () {
  var nextSection = $(this).closest("section").next("section");

  if (nextSection.length) {
    $("html, body").animate(
      {
        scrollTop: nextSection.offset().top,
      },
      800,
    );
  }
});
// vibe sec
$(document).ready(function () {
  const $box = $(".bllue-box");
  const $area = $(".vibe-boxes");
  const $cols = $(".vibe-col");

  let mouseX = 0,
    mouseY = 0;
  let currentX = 0,
    currentY = 0;
  let speed = 1; // smooth easing

  $area.on("mouseenter", function () {
    $box.css("opacity", 1);
  });

  $area.on("mouseleave", function () {
    $box.css("opacity", 0);
    $cols.removeClass("active-glow");
  });

  $area.on("mousemove", function (e) {
    const offset = $area.offset();

    // Position relative to vibe-boxes
    mouseX = e.pageX - offset.left;
    mouseY = e.pageY - offset.top;

    // Find hovered column (FASTER method)
    const $hovered = $(e.target).closest(".vibe-col");

    if ($hovered.length) {
      $cols.removeClass("active-glow");
      $hovered.addClass("active-glow");
    }
  });

  function animateGlow() {
    // Smooth follow
    currentX += (mouseX - currentX) * speed;
    currentY += (mouseY - currentY) * speed;

    $box.css("transform", `translate(${currentX}px, ${currentY}px)`);

    requestAnimationFrame(animateGlow);
  }

  animateGlow();
});
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.2,
    touchMultiplier: 1.5,
    lerp: 0.08,
  });

  // Sync Lenis scroll with ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // GSAP drives Lenis
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Refresh after layout is ready
  ScrollTrigger.refresh();

  // Resize fix
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });

  // Anchor smooth scroll
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = this.getAttribute("href");
      if (target.startsWith("#") && document.querySelector(target)) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });
});

