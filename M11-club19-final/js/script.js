jQuery(document).ready(function ($) {
  if ($(".give-timer").length) {
    const targetDate = new Date($(".give-timer").data("countdown")).getTime();
    let timer = null;

    function updateTimer() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        $(".days").text("00d");
        $(".hours").text("00h");
        $(".mins").text("00m");
        $(".sec").text("00s");
        if (timer) {
          clearInterval(timer);
        }
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
    timer = setInterval(updateTimer, 1000);
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
    const target = parseInt($counter.attr("data-count"), 10) || 0;

    function runCounter() {
      if ($counter.hasClass("counted")) return;

      $counter.addClass("counted");

      $({ countNum: 0 }).animate(
        { countNum: target },
        {
          duration: 2000,
          easing: "swing",
          step: function () {
            $counter.text(Math.floor(this.countNum));
          },
          complete: function () {
            $counter.text(target);
          },
        },
      );
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      observer.observe(this);
    } else {
      // Fallback for older browsers where IntersectionObserver is not available.
      runCounter();
    }
  });

  // winner-slider
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

//--- discount 2nd sec (explore section)------

document.addEventListener("DOMContentLoaded", function () {
  const catItems = document.querySelectorAll(".exp-cat-item");
  catItems.forEach((item, idx) => {
    const tr = document.createElement("span");
    tr.className = "grid-plus plus-tr";
    const br = document.createElement("span");
    br.className = "grid-plus plus-br";
    item.appendChild(tr);
    item.appendChild(br);

    if (idx === 0) {
      const tl = document.createElement("span");
      tl.className = "grid-plus plus-tl";
      const bl = document.createElement("span");
      bl.className = "grid-plus plus-bl";
      item.appendChild(tl);
      item.appendChild(bl);
    }
  });

  // Initialize Swiper for categories
  if (document.querySelector(".exp-grid")) {
    new Swiper(".exp-grid", {
      slidesPerView: 5,
      spaceBetween: 20,
      grabCursor: true,
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
        dragSize: 100,
      },
      breakpoints: {
        576: {
          slidesPerView: 2.2,
        },
        768: {
          slidesPerView: 3.5,
        },
        1024: {
          slidesPerView: 5,
        },
      },
    });
  }
});
