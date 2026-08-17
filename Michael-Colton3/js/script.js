jQuery(document).ready(function ($) {

  // ==========================================
  // LENIS SMOOTH SCROLL
  // ==========================================

  // gsap.registerPlugin(ScrollTrigger);

  // const lenis = new Lenis({
  //   duration: 1.2,
  //   easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  //   smoothWheel: true,
  //   smoothTouch: false,
  //   wheelMultiplier: 1.2,
  //   touchMultiplier: 1.5,
  //   lerp: 0.08,
  // });

  // lenis.on("scroll", ScrollTrigger.update);

  // gsap.ticker.add((time) => {
  //   lenis.raf(time * 1000);
  // });

  // gsap.ticker.lagSmoothing(0);

  // ScrollTrigger.refresh();

  // window.addEventListener("resize", () => {
  //   ScrollTrigger.refresh();
  // });

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => 1 - Math.pow(2, -10 * t),
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.2,
    touchMultiplier: 1.5,
    lerp: 0.08,
    infinite: false
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });

  window.lenis = lenis;
  // ==========================================
  // SMOOTH ANCHOR SCROLL
  // ==========================================

  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {

    anchor.addEventListener("click", function (e) {

      const target = this.getAttribute("href");

      if (
        target.startsWith("#") &&
        document.querySelector(target)
      ) {
        e.preventDefault();

        lenis.scrollTo(target, {
          offset: -80
        });
      }

    });

  });


  // ==========================================
  // COUNTER
  // ==========================================

  const kingRow = document.querySelector(".king-row");

  if (kingRow) {

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            const counters =
              entry.target.querySelectorAll(".k-crd h5");

            counters.forEach((counter) => {

              const originalText =
                counter.textContent.trim();

              const target =
                parseInt(originalText.replace(/,/g, ""));

              const duration = 2000;
              const startTime = performance.now();

              function updateCounter(currentTime) {

                const progress = Math.min(
                  (currentTime - startTime) / duration,
                  1
                );

                const ease =
                  1 - Math.pow(1 - progress, 4);

                const currentValue =
                  Math.floor(ease * target);

                counter.textContent =
                  currentValue.toLocaleString() + "+";

                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                }

              }

              requestAnimationFrame(updateCounter);

            });

            // Run only once
            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.3
      }
    );

    counterObserver.observe(kingRow);

  }


  // ==========================================
  // TESTIMONIAL SLIDER
  // ==========================================

  if ($(".test-slider").length) {

    $(".test-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: $(".sli-arrws .pre"),
      nextArrow: $(".sli-arrws .nxt"),
      infinite: true,
      autoplay: true,
      autoplaySpeed: 4000,
      fade: true,
      cssEase: "linear"
    });

  }


  // ==========================================
  // TEACH SLIDER
  // ==========================================

  // if ($(".teach-slider-main").length) {

  //   $(".teach-slider-main").slick({
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //     infinite: true,
  //     arrows: true,
  //     dots: false,
  //     speed: 600,

  //     responsive: [
  //       {
  //         breakpoint: 575,
  //         settings: {
  //           arrows: false,
  //           infinite: true,
  //           dots: true,
  //           autoplay: true,
  //           autoplaySpeed: 2000
  //         }
  //       }
  //     ]
  //   });
  // }

  // ==========================================
  // TEACH SLIDER
  // ==========================================
  if ($(".teach-slider-main").length) {

    $(".teach-slider-main").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      dots: false,
      speed: 600,

      responsive: [
        {
          breakpoint: 576,
          settings: {
            arrows: false,
            infinite: true,
            dots: true,
            autoplay: true,
            autoplaySpeed: 2000
          }
        }
      ]
    });

    // Pause every video in the slider and bring back its thumbnail/play button
    function pauseAllVideos() {
      $(".teach-video-box").each(function () {
        var $box = $(this);
        var video = $box.find(".teach-video").get(0);
        if (video && !video.paused) {
          video.pause();
        }
        $box.removeClass("is-playing");
      });
    }

    // Click play button -> hide thumbnail, show + play video
    $(".teach-slider-main").on("click", ".teach-play", function () {
      var $box = $(this).closest(".teach-video-box");
      var video = $box.find(".teach-video").get(0);
      if (!video) return;

      pauseAllVideos();          // stop any other video first
      $box.addClass("is-playing"); // fades out img + button
      video.play();
    });

    // Video finishes -> bring thumbnail and play button back
    $(".teach-slider-main").on("ended", ".teach-video", function () {
      $(this).closest(".teach-video-box").removeClass("is-playing");
    });

    // Changing slides -> pause whatever is playing, reset thumbnail
    $(".teach-slider-main").on("beforeChange", function () {
      pauseAllVideos();
    });

  }
  // ==========================================
  // TEACH VIDEO
  // ==========================================

  function stopVideos() {

    $(".teach-video").each(function () {

      this.pause();
      this.currentTime = 0;
      this.controls = false;

    });

    $(".teach-video-box").removeClass("playing");

  }


  $(".teach-play").on("click", function () {

    stopVideos();

    const $box =
      $(this).closest(".teach-video-box");

    const video =
      $box.find(".teach-video")[0];

    if (video) {

      video.controls = true;
      video.play();

      $box.addClass("playing");

    }

  });


  $(".teach-slider-main").on(
    "beforeChange",
    stopVideos
  );


  $(".teach-video").on("ended", function () {

    this.controls = false;

    $(this)
      .closest(".teach-video-box")
      .removeClass("playing");

  });


  // ==========================================
  // PLATFORM TABS
  // ==========================================

  const tabs = document.querySelectorAll(".platform-tabs button");
  const cards = document.querySelectorAll(".social-card");

  // Group cards by platform once
  const cardsByPlatform = {};
  cards.forEach((card) => {
    const platform = card.getAttribute("data-platform");
    if (!cardsByPlatform[platform]) cardsByPlatform[platform] = [];
    cardsByPlatform[platform].push(card);
  });

  function getRoundRobinSelection(limit) {
    const platforms = Object.keys(cardsByPlatform);
    const selected = [];
    let index = 0;

    while (selected.length < limit) {
      let addedAny = false;

      for (const platform of platforms) {
        if (selected.length >= limit) break;
        const platformCards = cardsByPlatform[platform];
        if (index < platformCards.length) {
          selected.push(platformCards[index]);
          addedAny = true;
        }
      }

      index++;
      if (!addedAny) break;
    }

    return selected;
  }

  // Reusable function — filters cards for a given tab
  function applyFilter(filter) {
    cards.forEach((card) => card.classList.add("hidden"));

    if (filter === "all") {
      const selected = getRoundRobinSelection(6);
      selected.forEach((card) => card.classList.remove("hidden"));
    } else {
      const platformCards = cardsByPlatform[filter] || [];
      platformCards.slice(0, 6).forEach((card) => card.classList.remove("hidden"));
    }
  }

  // Wire up tab clicks
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");
      applyFilter(filter);
    });
  });

  // Run once on page load, using whichever tab is marked active in HTML (defaulting to "all")
  const initialTab = document.querySelector(".platform-tabs button.active");
  const initialFilter = initialTab ? initialTab.getAttribute("data-filter") : "all";
  applyFilter(initialFilter);


  // ==========================================
  // VIDEO SIDE
  // ==========================================

  $(".video-side").each(function () {

    const $box = $(this);

    const video =
      $box.find(".card-video")[0];

    const button =
      $box.find(".video-play-btn")[0];


    if (!video || !button) return;


    $(button).on("click", function () {

      video.play();

      $(button).addClass("hide");

    });


    $(video).on("ended", function () {

      $(button).removeClass("hide");

      video.currentTime = 0;

    });

  });


  // ==========================================
  // AOS
  // ==========================================

  window.addEventListener("load", function () {

    AOS.init({
      duration: 1000,
      once: false
    });

    setTimeout(function () {
      AOS.refreshHard();
    }, 200);

  });

  // library slider 
  $('.libery-warrper').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    dots: false,
    autoplay: false,
    speed: 600
  });



  // dollar amount box

// Giving accordion
$('.giving-opt').on('click', function (e) {
    e.preventDefault();

    const $item = $(this).closest('.giving-opt-elemnt');
    const currentScroll = window.pageYOffset;

    $('.giving-opt-elemnt')
        .not($item)
        .removeClass('active');

    $item.addClass('active');

    requestAnimationFrame(function () {
        window.scrollTo(0, currentScroll);
    });
});


// Donation frequency
const buttons = document.querySelectorAll(".btnsgiv");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(item => item.classList.remove("active"));
        btn.classList.add("active");
    });
});


// Donation amount
const amountBoxes = document.querySelectorAll(".amount-box");

amountBoxes.forEach(box => {
    box.addEventListener("click", () => {
        amountBoxes.forEach(item => item.classList.remove("active"));
        box.classList.add("active");
    });
});


  // ==========================================
  // HEADER SCROLL
  // ==========================================

  // Uncomment if required

  // $(window).on("scroll", function () {
  //   $("header").toggleClass(
  //     "active",
  //     $(this).scrollTop() > 50
  //   );
  // });

});