document.querySelectorAll(".dual-range-slider").forEach((slider) => {
  const minSlider = slider.querySelector(".range-min");
  const maxSlider = slider.querySelector(".range-max");
  const activeRange = slider.querySelector(".slider-range");

  const valuesContainer =
    slider.parentElement.querySelector(".range-values");

  const minInput = valuesContainer.querySelectorAll("input")[0];
  const maxInput = valuesContainer.querySelectorAll("input")[1];

  const gap = 0;

  function updateSlider() {
    let minValue = parseInt(minSlider.value);
    let maxValue = parseInt(maxSlider.value);

    if (minValue > maxValue - gap) {
      minValue = maxValue - gap;
      minSlider.value = minValue;
    }

    if (maxValue < minValue + gap) {
      maxValue = minValue + gap;
      maxSlider.value = maxValue;
    }

    const min = parseInt(minSlider.min);
    const max = parseInt(minSlider.max);

    const left = ((minValue - min) / (max - min)) * 100;
    const right = ((maxValue - min) / (max - min)) * 100;

    activeRange.style.left = `${left}%`;
    activeRange.style.width = `${right - left}%`;

    if (max === 10) {
      minInput.value = `${minValue}%`;
      maxInput.value = `${maxValue}%`;
    } else {
      minInput.value = `$${minValue.toLocaleString()}`;
      maxInput.value = `$${maxValue.toLocaleString()}`;
    }
  }

  minSlider.addEventListener("input", updateSlider);
  maxSlider.addEventListener("input", updateSlider);

  updateSlider();
});