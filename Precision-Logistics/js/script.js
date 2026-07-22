$(document).ready(function () {
  // ==============================
  // GSAP + ScrollTrigger Setup
  // ==============================

  // ==============================
  // LENIS SMOOTH SCROLL
  // ==============================
  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    lerp: 0.08,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value);
      } else {
        return window.scrollY;
      }
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener("refresh", () => lenis.update());

  // ==============================
  // SLICK SLIDER
  // ==============================
  const $slider = $(".pri-slider");
  const totalSlides = $slider.children().length;

  $(".slide-num p").html("<span>1</span>/" + totalSlides);

  $slider.on("init reInit afterChange", function (event, slick, currentSlide) {
    let i = (currentSlide ? currentSlide : 0) + 1;
    $(".slide-num span").text(i);
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

  // Refresh ScrollTrigger after slider init
  $slider.on("afterChange", function () {
    ScrollTrigger.refresh();
  });

  // ==============================
  // SCROLL INDICATOR
  // ==============================
  $(".scroll-indicator").on("click", function () {
    const nextSection = $(this).closest("section").next("section");

    if (nextSection.length) {
      lenis.scrollTo(nextSection[0], { offset: -80 });
    }
  });

  // ==============================
  // VIBE BOX GLOW FOLLOW
  // ==============================
  const $box = $(".bllue-box");
  const $area = $(".vibe-boxes");
  const $cols = $(".vibe-col");

  let mouseX = 0,
    mouseY = 0;
  let currentX = 0,
    currentY = 0;

  $area.on("mouseenter", () => $box.css("opacity", 1));
  $area.on("mouseleave", () => {
    $box.css("opacity", 0);
    $cols.removeClass("active-glow");
  });

  $area.on("mousemove", function (e) {
    const offset = $area.offset();

    mouseX = e.pageX - offset.left;
    mouseY = e.pageY - offset.top;

    const $hovered = $(e.target).closest(".vibe-col");

    if ($hovered.length) {
      $cols.removeClass("active-glow");
      $hovered.addClass("active-glow");
    }
  });

  function animateGlow() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    $box.css("transform", `translate(${currentX}px, ${currentY}px)`);
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ==============================
  // HERO HEADING ANIMATION
  // ==============================
  const h1 = document.querySelector(".hero-content h1");

  if (h1) {
    const text = h1.textContent.trim().replace(/\s+/g, " ");
    h1.innerHTML = "";

    text.split(" ").forEach((word, i, arr) => {
      const span = document.createElement("span");
      span.classList.add("word");
      span.textContent = word;
      h1.appendChild(span);

      if (i !== arr.length - 1) {
        h1.appendChild(document.createTextNode(" "));
      }
    });

    const words = document.querySelectorAll(".hero-content h1 .word");

    gsap.from(words, {
      opacity: 0,
      x: -50,
      y: -60,
      rotation: -8,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  // ==============================
  // SCROLL HEADING COLOR ANIMATION
  // ==============================
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".animated-scroll-sec h2").forEach((heading) => {
    // 👉 Prevent duplicate splitting
    if (heading.classList.contains("split-done")) return;
    heading.classList.add("split-done");

    // 👉 Clean word split
    let words = heading.textContent.trim().split(/\s+/);

    heading.innerHTML = words
      .map((word) => `<span>${word}&nbsp;</span>`)
      .join("");

    let spans = heading.querySelectorAll("span");

    gsap.set(spans, { color: "#999" });

    gsap.to(spans, {
      color: "#071D2F",
      stagger: 0.08,
      ease: "power1.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 80%",
        end: "top 30%",
        scrub: true,
        // markers: true,
      },
    });
  });

  // ==============================
  // BB-BTM IMAGE ANIMATION (FIXED)
  // ==============================
  gsap.from(".bb-btm img", {
    y: 120,
    opacity: 0,
    duration: 1,
    stagger: 0.25,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".bb-btm",
      start: "top 85%",
      toggleActions: "play none none none",
      scroller: document.body,
    },
  });

  // ==============================
  // PAGE LOADER (CURTAIN EFFECT)
  // ==============================

  // ==============================
  // PAGE LOADER (CURTAIN EFFECT)
  // ==============================

  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";

  if (!isHomePage) {
    if (typeof lenis !== "undefined") {
      lenis.stop();
    }

    $("body, html").css("overflow", "hidden");

    const tlLoader = gsap.timeline({
      onComplete: function () {
        if (typeof lenis !== "undefined") {
          lenis.start();
        }

        $("body, html").css("overflow", "");
        $(".page-loader").fadeOut(300);

        ScrollTrigger.refresh();
      },
    });

    gsap.set(".long", { x: 0 });
    tlLoader
      .to(
        ".long.drk-blue",
        {
          y: "100%",
          duration: 1.4,
          ease: "power4.inOut",
        },
        0,
      )
      .to(
        ".long.whitebg",
        {
          y: "100%",
          duration: 1.4,
          ease: "power4.inOut",
        },
        0.3,
      );

    // 👇 ADD THIS PART (content reveal)
    tlLoader.to(
      [".inner-headr", ".hero-cntnt", ".logistics-group"],
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.5,
      },
      "-=0", // starts slightly before loader fully ends
    );
  }

  // // service page gsap for cards

  let mm = gsap.matchMedia();

  // 👉 DESKTOP (above 767px)
  mm.add("(min-width: 768px)", function () {
    let $cards = $(".our-crd");
    let total = $cards.length;

    function setHeight() {
      let imgHeight = $(".sr-img img").outerHeight();

      $(".our-sr-rgt").css("height", imgHeight);
      $(".our-cntnt").css("height", imgHeight);

      return imgHeight;
    }

    let imgHeight = setHeight();

    gsap.set($cards, {
      y: "100%",
      scale: 0.85,
      opacity: 0.5,
    });

    gsap.set($cards.eq(0), {
      y: "0%",
      scale: 1,
      opacity: 1,
      zIndex: 1,
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".our-srvc-sec",
        start: "top top",
        end: "+=" + imgHeight * total,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    $cards.each(function (i) {
      if (i === 0) return;

      let $card = $(this);
      let $prevCard = $cards.eq(i - 1);

      tl.set($card, { zIndex: i + 1 });

      // 👉 New card comes in
      tl.to($card, {
        y: "0%",
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });

      // 👉 Previous card goes down
      tl.to(
        $prevCard,
        {
          scale: 0.85,
          opacity: 0.5,
          duration: 1,
          ease: "power2.out",
        },
        "<",
      );

      // 👉 Progress bar (step)
      tl.to(
        ".progres-fill",
        {
          width: ((i + 1) / total) * 100 + "%",
          backgroundColor: "#fff",
          duration: 1,
          ease: "none",
        },
        "<",
      );
    });
  });

  // 👉 MOBILE (below 767px)
  mm.add("(max-width: 767px)", function () {
    let $cards = $(".our-crd");
    let total = $cards.length;

    // 👉 OPTION 1: smooth progress
    gsap.to(".progres-fill", {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".our-srvc-sec",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // 👉 OPTION 2 (better UX): step progress per card
    $cards.each(function (i) {
      ScrollTrigger.create({
        trigger: this,
        start: "top center",
        onEnter: function () {
          gsap.to(".progres-fill", {
            width: ((i + 1) / total) * 100 + "%",
            duration: 0.3,
          });
        },
        onEnterBack: function () {
          gsap.to(".progres-fill", {
            width: ((i + 1) / total) * 100 + "%",
            duration: 0.3,
          });
        },
      });
    });
  });

  // 👉 Recalculate on resize
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });

  // 👉 Handle resize (important)
  $(window).on("resize", function () {
    ScrollTrigger.refresh();
  });

  // =======================
  // why-choose-slider
  // =======================

  const $slider1 = $(".why-choose-slider");
  const $progressBar = $(".progress-br");

  $slider1.on("init reInit afterChange", function (event, slick, currentSlide) {
    let current = currentSlide || 0;

    let totalSlides = slick.slideCount;
    let slidesToShow = slick.options.slidesToShow;

    // total possible moves
    let totalSteps = totalSlides - slidesToShow;

    if (totalSteps <= 0) {
      $progressBar.css("width", "100%");
      return;
    }

    let progress = (current / totalSteps) * 100;

    // prevent overflow > 100%
    progress = Math.min(progress, 100);

    $progressBar.css("width", progress + "%");
  });

  $slider1.slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  });

  // ==============================
  // FINAL REFRESH
  // ==============================
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
});
