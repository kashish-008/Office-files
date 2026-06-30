jQuery(document).ready(function ($) {
  if ($(".give-timer").length) {
    const targetDate = new Date($(".give-timer").data("countdown")).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        $(".days").text("00d");
        $(".hours").text("00h");
        $(".mins").text("00m");
        $(".sec").text("00s");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      $(".days").text(days + "d");
      $(".hours").text(hours + "h");
      $(".mins").text(mins + "m");
      $(".sec").text(secs + "s");
    }

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
  }
  if ($(".time-grid").length) {
    $(".time-grid").each(function () {
      const $timer = $(this);
      const targetDate = new Date($timer.data("date")).getTime();

      function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
          $timer.find(".days").text("00");
          $timer.find(".hours").text("00");
          $timer.find(".minutes").text("00");
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        $timer.find(".days").text(String(days).padStart(2, "0"));
        $timer.find(".hours").text(String(hours).padStart(2, "0"));
        $timer.find(".minutes").text(String(minutes).padStart(2, "0"));
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    });
  }

  $(".counter").each(function () {
    const $counter = $(this);

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !$counter.hasClass("counted")) {
            $counter.addClass("counted");

            $({ countNum: 0 }).animate(
              { countNum: $counter.data("count") },
              {
                duration: 2000,
                easing: "swing",
                step: function () {
                  $counter.text(Math.floor(this.countNum));
                },
                complete: function () {
                  $counter.text($counter.data("count"));
                },
              },
            );

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(this);
  });

  var $slider = $(".winner_sldr");

  $slider.on("init reInit afterChange", function (event, slick, currentSlide) {
    var i = (currentSlide ? currentSlide : 0) + 1;
    var totalSlides = slick.slideCount;

    var progress = (i / totalSlides) * 100;

    $(".progess-bar .innr-bar").css("width", progress + "%");
  });

  $slider.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    arrows: false,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  const $section = $(".giveway_win_sec");
  const $drag = $(".drag");

  $section.on("mouseenter", function () {
    $drag.css("opacity", "1");
  });

  $section.on("mouseleave", function () {
    $drag.css("opacity", "0");
  });

  $section.on("mousemove", function (e) {
    $drag.css({
      left: e.clientX + "px",
      top: e.clientY + "px",
    });
  });

  var totalCards = $(".spend-less-slider .feat-card").length;
  var slidesToShow = 3;
  var totalGroups = Math.ceil(totalCards / slidesToShow);

  function updateFooter(currentIndex) {
    var group = Math.floor(currentIndex / slidesToShow) + 1;
    if (group > totalGroups) group = totalGroups;

    $(".spend-counter .current-slide").text(group);
    $(".spend-counter .total-slides").text(totalGroups);

    var percent = (group / totalGroups) * 100;
    $(".spend-progress-fill").css("width", percent + "%");
  }

  $(".spend-less-slider").slick({
    slidesToShow: 3,
    slidesToScroll: 3,
    infinite: false,
    arrows: false,
    dots: false,
    speed: 500,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".spend-counter .total-slides").text(totalGroups);

  $(".spend-prev").on("click", function () {
    $(".spend-less-slider").slick("slickPrev");
    $(".spend-prev").addClass("active");
    $(".spend-next").removeClass("active");
  });

  $(".spend-next").on("click", function () {
    $(".spend-less-slider").slick("slickNext");
    $(".spend-next").addClass("active");
    $(".spend-prev").removeClass("active");
  });

  $(".spend-less-slider").on("afterChange", function (e, slick, currentSlide) {
    updateFooter(currentSlide);
  });

  updateFooter(0);
});

window.addEventListener("scroll", function () {
  const header = document.querySelector(".nav_hdr");
  if (window.scrollY > 50) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
});

(function () {
  var target = new Date("2026-07-02T12:00:00");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    var diff = target - new Date();
    if (diff <= 0) {
      document.getElementById("gc-days").textContent = "0";
      document.getElementById("gc-hours").textContent = "00";
      document.getElementById("gc-mins").textContent = "00";
      document.getElementById("gc-secs").textContent = "00";
      return;
    }
    var s = Math.floor(diff / 1000);
    var secs = s % 60;
    var m = Math.floor(s / 60);
    var mins = m % 60;
    var h = Math.floor(m / 60);
    var hours = h % 24;
    var days = Math.floor(h / 24);

    document.getElementById("gc-days").textContent = days;
    document.getElementById("gc-hours").textContent = pad(hours);
    document.getElementById("gc-mins").textContent = pad(mins);
    document.getElementById("gc-secs").textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();
