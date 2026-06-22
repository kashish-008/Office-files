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
