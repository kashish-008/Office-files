// ----------------------

const header = document.querySelector("header");

function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleScroll);

window.addEventListener("load", handleScroll);
// ----------------------

const counters = document.querySelectorAll('.count');
const section = document.querySelector('.counter-section');

let started = false;

const startCounting = () => {
  if (started) return;
  started = true;

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;

    const updateCount = () => {
      const increment = target / 100;

      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count).toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };

    updateCount();
  });
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounting();
    }
  });
}, {
  threshold: 0.5 
});

observer.observe(section);

// ---------------------------

$('.testimonial-slider').slick({
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: false,
    speed: 600
  });



// --------------------


const toggler = document.querySelector('.custom-toggler');

toggler.addEventListener('click', function () {
    this.classList.toggle('active');
});