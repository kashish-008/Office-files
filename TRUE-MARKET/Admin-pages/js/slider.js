document.querySelectorAll(".dual-range-slider").forEach((slider) => {
  const [minS, maxS] = slider.querySelectorAll(".range-min, .range-max");
  const activeRange = slider.querySelector(".slider-range");
  const [minIn, maxIn] = slider.parentElement.querySelectorAll(".range-values input");
  const minLimit = parseInt(minS.min), maxLimit = parseInt(minS.max);

  function updateSlider() {
    let minV = parseInt(minS.value), maxV = parseInt(maxS.value);

    if (minV > maxV) minS.value = minV = maxV;
    if (maxV < minV) maxS.value = maxV = minV;

    const left = ((minV - minLimit) / (maxLimit - minLimit)) * 100;
    const right = ((maxV - minLimit) / (maxLimit - minLimit)) * 100;

    activeRange.style.left = `${left}%`;
    activeRange.style.width = `${right - left}%`;

    const isPercent = maxLimit === 10;
    minIn.value = isPercent ? `${minV}%` : `$${minV.toLocaleString()}`;
    maxIn.value = isPercent ? `${maxV}%` : `$${maxV.toLocaleString()}`;
  }

  slider.addEventListener("input", updateSlider);
  updateSlider();
});

// ----------------------

const confidenceSlider = document.getElementById("confidenceSlider");
const valueText = document.getElementById("confidenceValue");
const progressCircle = document.querySelector(".circle-progress");
const rangeFill = document.getElementById("rangeFill");

if (confidenceSlider && valueText && progressCircle && rangeFill) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = circumference;

  function updateConfidence(value) {
    valueText.textContent = value + "%";
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    rangeFill.style.width = value + "%";
  }

  updateConfidence(confidenceSlider.value);

  confidenceSlider.addEventListener("input", function () {
    updateConfidence(this.value);
  });
}

// ---------------------

const compSlider = document.querySelector('.comp-slider');

function updateSliderBackground() {
  if (!compSlider) return;

  const percentage = ((compSlider.value - compSlider.min) / (compSlider.max - compSlider.min)) * 100;
  compSlider.style.background = `linear-gradient(to right, #00a651 ${percentage}%, #C2C2C2 ${percentage}%)`;
}

if (compSlider) {
  compSlider.addEventListener('input', updateSliderBackground);
  updateSliderBackground();
}

// ---------------------

// Make horizontal table scrollable by drag
const el = document.querySelector(".table-responsive");
let down = false, x, left;

el.addEventListener("mousedown", e => { down = true; x = e.pageX - el.offsetLeft; left = el.scrollLeft; });
el.addEventListener("mouseleave", () => down = false);
el.addEventListener("mouseup", () => down = false);
el.addEventListener("mousemove", e => { if (!down) return; e.preventDefault(); el.scrollLeft = left - (e.pageX - el.offsetLeft - x) * 1.5; });