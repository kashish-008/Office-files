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
