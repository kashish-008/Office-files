document.querySelectorAll(".custom-select.bulk-btn").forEach((dropdown) => {
  const label = dropdown.querySelector(".custom-label a");
  const options = dropdown.querySelector(".custom-select-options");
  const optionLinks = dropdown.querySelectorAll(".custom-select-options a");

  // Open/Close dropdown
  label.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    document.querySelectorAll(".custom-select-options.active").forEach((item) => {
      if (item !== options) {
        item.classList.remove("active");
      }
    });

    options.classList.toggle("active");
  });

  // Select value
  optionLinks.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();

      label.textContent = option.textContent;
      options.classList.remove("active");
    });
  });
});

// Close when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".custom-select-options.active").forEach((item) => {
    item.classList.remove("active");
  });
});