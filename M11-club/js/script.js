$(document).ready(function () {
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
});

$(function () {
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
});

window.addEventListener("scroll", function () {
  const header = document.querySelector(".nav_hdr");

  if (window.scrollY > 50) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
});




$('.counter').each(function () {
    const $counter = $(this);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting && !$counter.hasClass('counted')) {

                $counter.addClass('counted');

                $({ countNum: 0 }).animate(
                    { countNum: $counter.data('count') },
                    {
                        duration: 2000,
                        easing: 'swing',
                        step: function () {
                            $counter.text(Math.floor(this.countNum));
                        },
                        complete: function () {
                            $counter.text($counter.data('count'));
                        }
                    }
                );

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(this);
});

