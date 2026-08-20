const eatSwiper = new Swiper('.eat-slider', {
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 20,
  grabCursor: true,
  loop: true,
  loopAdditionalSlides: 6,
  slidesPerGroupAuto: true,
  watchSlidesProgress: true,

  breakpoints: {
    0: {
      slidesPerView: 1,
      centeredSlides: false,
      spaceBetween: 10
    },
    768: {
      slidesPerView: 2,
      centeredSlides: false,
      spaceBetween: 15
    },
    992: {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 20
    }
  },

  on: {
    progress: function () {
      const percent = (this.progress + 1) / 2 * 100;
      document.querySelector('.progress-bar .bar').style.width = percent + '%';
    }
  }
});