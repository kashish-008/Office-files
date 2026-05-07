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

const sections = document.querySelectorAll('.counter-section');

sections.forEach(section => {

  const counters = section.querySelectorAll('.count');
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
        observer.unobserve(section); // run only once
      }
    });
  }, { threshold: 0.5 });

  observer.observe(section);
});
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


// ----------------------

$('.services-slider').slick({
  slidesToShow: 3,
  arrows: true,
  dots: false,
  infinite: false,
  speed: 600,
  autoplay: false,

  prevArrow: '<button class="slider-prev"><i class="fa-solid fa-angle-left"></i></button>',
  nextArrow: '<button class="slider-next"><i class="fa-solid fa-angle-right"></i></button>',

  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        arrows: false,
        dots: true,
      }
    }
  ]
});

$('.services-slider').on('afterChange', function (event, slick, currentSlide) {

  if (slick.currentSlide === 0) {
    $('.slider-prev').addClass('disabled-btn');
  } else {
    $('.slider-prev').removeClass('disabled-btn');
  }

  if (slick.currentSlide === slick.slideCount - slick.options.slidesToShow) {
    $('.slider-next').addClass('disabled-btn');
  } else {
    $('.slider-next').removeClass('disabled-btn');
  }

});

// -------------------------
const tabs = document.querySelectorAll(".news-tab");
const contents = document.querySelectorAll(".news-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {

    // remove active from all tabs
    tabs.forEach(t => t.classList.remove("active"));

    // hide all contents
    contents.forEach(content => content.classList.remove("active"));

    // add active to clicked tab
    tab.classList.add("active");

    // show target content
    const target = tab.getAttribute("data-target");
    document.getElementById(target).classList.add("active");

  });
});
// ---------------




// ---------------------------------------------
// Bootstrap form validation error
(() => {
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();



// --------------------


$(".partner-slider").slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
  infinite: true,
  speed: 1000,
  prevArrow: '<button class="slick-prev custom-arrow"><i class="fa-solid fa-chevron-left"></i></button>',
  nextArrow: '<button class="slick-next custom-arrow"><i class="fa-solid fa-chevron-right"></i></button>',
  pauseOnHover: false,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
});


// =========================
// DATA (EDIT HERE ONLY)
// =========================
const partnerData = {
  1: {
    name: "Yumiko Dougherty",
    img: "image/p1.png",
    desc: "Yumiko brings 15 years of experience designing and leading strategic planning efforts with diverse partners to create a shared vision and roadmap forward. Her consulting firm, Ignite the Change Advisors, was born out of a desire to explore strategic and collaborative solutions to complex social problems while modeling compassionate leadership and elevating lived expertise. Yumiko excels at designing and leading interactive planning sessions with diverse partners to create a shared vision and roadmap forward.",
    linkedin: "https://linkedin.com/",
    twitter: "https://twitter.com/"
  },
  2: {
    name: "partner 2",
    img: "image/p2.png",
    desc: "Second card custom description here.",
    linkedin: "https://linkedin.com/",
    twitter: "https://twitter.com/"
  },
  3: {
    name: "partner 3",
    img: "image/p3.png",
    desc: "Third partner description.",
    linkedin: "https://linkedin.com/",
    twitter: "https://twitter.com/"
  },
  4: {
    name: "partner 4",
    img: "image/p4.png",
    desc: "Fourth partner description.",
    linkedin: "https://linkedin.com/",
    twitter: "https://twitter.com/"
  }
};

$("body").append('<div class="popup-overlay"></div>');

$(document).on("click", ".prtnr-crd", function () {

  let id = $(this).attr("data-id"); // 🔥 KEY FIX

  let data = partnerData[id];

  if (!data) return;

  // set content
  $(".pop-up-img img").attr("src", data.img);
  $(".pop-up-cntnt h3").text(data.name);
  $(".pop-up-cntnt p").text(data.desc);

  $(".pop-links").eq(0).attr("href", data.linkedin);
  $(".pop-links").eq(1).attr("href", data.twitter);

  // show popup
  $(".popup-wrapper").addClass("active");
  $(".popup-overlay").addClass("active");
  $("body").addClass("modal-open");
});
function closePopup() {
  $(".popup-wrapper").removeClass("active");
  $(".popup-overlay").removeClass("active");
  $("body").removeClass("modal-open");
}

$(document).on("click", ".close-btn", closePopup);
$(document).on("click", ".popup-overlay", closePopup);

$(document).on("keydown", function (e) {
  if (e.key === "Escape") closePopup();
});


// -------------------------

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const textElements = document.querySelectorAll(".animate");

  textElements.forEach(textElement => {
      const text = textElement.textContent;
      textElement.innerHTML = text.split("").map(char => `<span>${char}</span>`).join("");

      const chars = textElement.querySelectorAll("span");

      gsap.from(chars, {
          scrollTrigger: {
              trigger: textElement,
              start: "top 85%",
              end: "bottom 20%",
              scrub: true,
          },
          color: "#00000040",
          stagger: 1,  // Delay between each character animation
          duration: 1,
      });
  });
})

// ----------------------------------

// File upload file
const fileInput = document.querySelector("#file-upload");
const fileText = document.querySelector(".file-text");

fileInput.parentElement.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", function () {
  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    fileText.innerHTML = `<i class="fas fa-check-circle"></i><br>${fileName}`;
    fileInput.closest(".custom-file-upload").classList.add("file-selected");
  } else {
    fileText.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><br>Click to Upload or drag & drop`;
    fileInput.closest(".custom-file-upload").classList.remove("file-selected");
  }
});

