/**
 * DO San Diego - Frontend Interactive Behavior
 */

document.addEventListener('DOMContentLoaded', () => {
    // Filter tag pills toggle interaction
    const pills = document.querySelectorAll('.pill-tag');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // -----------------------------------------------------------------
    // "Eat" restaurant slider — draggable, with progress bar + keyboard nav
    // Wrapped in its own IIFE so its variables/functions (currentIndex,
    // slides, dragStart, etc.) never collide with the Stay/Todo sliders
    // below, even though they use similarly named internals.
    // -----------------------------------------------------------------
    (function initEatSlider() {
        const slider = document.querySelector(".main-wrap-slider");
        const progressBarContainer = document.querySelector(".progress-bar");
        const progressBar = document.querySelector(".progress-bar .bar");

        if (!slider || !progressBar) return;

        const originalSlides = Array.from(slider.querySelectorAll(".slide-wrap"));
        const N = originalSlides.length;
        if (!N) return;

        // Fixed-width progress bar track
        if (progressBarContainer) {
            progressBarContainer.style.width = "440px";
        }

        // --- Build infinite loop track: clone one full set before + after
        // the real slides, so there's always content to slide into in
        // either direction ---
        const beforeFrag = document.createDocumentFragment();
        const afterFrag = document.createDocumentFragment();

        originalSlides.forEach((node) => {
            const clone = node.cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            beforeFrag.appendChild(clone);
        });
        originalSlides.forEach((node) => {
            const clone = node.cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            afterFrag.appendChild(clone);
        });

        slider.insertBefore(beforeFrag, slider.firstChild);
        slider.appendChild(afterFrag);

        const slides = Array.from(slider.querySelectorAll(".slide-wrap"));
        const REAL_START = N; // index where the real (non-cloned) slides begin

        let currentIndex = REAL_START;
        let startX = 0;
        let currentX = 0;
        let startTranslate = 0;
        let isDragging = false;
        let resizeTimeout;
        let hasSetInitialFill = false;

        // Get number of slides to show based on viewport
        function getSlidesToShow() {
            if (window.innerWidth < 767) return 1;
            if (window.innerWidth < 992) return 2;
            return 3;
        }

        // Get the container width and slide width
        function getSlideWidth() {
            const containerWidth = slider.parentElement.offsetWidth;
            return containerWidth / getSlidesToShow();
        }

        // Keeps currentIndex mapped back into the real (non-cloned) block
        function normalizeIndex(idx) {
            while (idx < REAL_START) idx += N;
            while (idx >= REAL_START + N) idx -= N;
            return idx;
        }

        // Cyclic progress: fills 0 -> 100% across one loop through the real
        // slides, then repeats. On first load it's forced to 20% per spec.
        function updateProgress() {
            if (!hasSetInitialFill) {
                progressBar.style.width = "20%";
                hasSetInitialFill = true;
                return;
            }
            const cyclic = (((currentIndex - REAL_START) % N) + N) % N;
            const progress = ((cyclic + 1) / N) * 100;
            progressBar.style.width = progress + "%";
        }

        // Mark the slide centered in the visible group as active, and
        // update the caption below the slider to match it
        function updateActiveSlide() {
            const slidesToShow = getSlidesToShow();
            const centerOffset = Math.floor((slidesToShow - 1) / 2);
            const activeIndex = currentIndex + centerOffset;

            slides.forEach((slide, idx) => {
                slide.classList.toggle("active-slide", idx === activeIndex);
            });

            const activeTitleEl = document.getElementById("eatActiveTitle");
            if (activeTitleEl) {
                const activeSlide = slides[activeIndex];
                const titleEl = activeSlide ? activeSlide.querySelector("h5") : null;
                const img = activeSlide ? activeSlide.querySelector("img") : null;
                const titleText =
                    (titleEl && titleEl.textContent.trim()) ||
                    (img && img.getAttribute("alt")) ||
                    "Restaurants";
                activeTitleEl.textContent = titleText;
            }
        }

        function moveSlider(animate = true) {
            const slideWidth = getSlideWidth();
            slider.style.transition = animate
                ? "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none";
            slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateProgress();
            updateActiveSlide();
        }

        // After the visible transition finishes, silently snap back into the
        // real block if we've drifted into a cloned block — this is what
        // makes the loop feel infinite instead of hitting an edge.
        function settleAfterTransition() {
            const normalized = normalizeIndex(currentIndex);
            if (normalized !== currentIndex) {
                currentIndex = normalized;
                moveSlider(false);
            }
        }

        slider.addEventListener("transitionend", function (e) {
            if (e.propertyName !== "transform") return;
            settleAfterTransition();
        });

        function goTo(index, animate = true) {
            currentIndex = index;
            moveSlider(animate);
            if (!animate) settleAfterTransition();
        }

        // Handle drag start
        function dragStart(e) {
            isDragging = true;
            slider.classList.add("is-dragging");

            const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
            startX = clientX;
            currentX = clientX;
            startTranslate = -(currentIndex * getSlideWidth());

            slider.style.transition = "none";
        }

        // Handle drag move
        function dragMove(e) {
            if (!isDragging) return;

            const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
            currentX = clientX;

            const diff = currentX - startX;
            slider.style.transition = "none";
            slider.style.transform = `translateX(${startTranslate + diff}px)`;
        }

        // Handle drag end
        function dragEnd() {
            if (!isDragging) return;

            isDragging = false;
            slider.classList.remove("is-dragging");

            const diff = currentX - startX;
            const threshold = 30; // Minimum drag distance to trigger slide change

            if (Math.abs(diff) > threshold) {
                if (diff < 0) {
                    goTo(currentIndex + 1); // Swipe left - next slide
                } else {
                    goTo(currentIndex - 1); // Swipe right - previous slide
                }
            } else {
                moveSlider(true); // Snap back
            }

            startX = 0;
            currentX = 0;
        }

        // Mouse events
        slider.addEventListener("mousedown", dragStart);
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);

        // Touch events
        slider.addEventListener("touchstart", dragStart, { passive: true });
        slider.addEventListener("touchmove", dragMove, { passive: true });
        slider.addEventListener("touchend", dragEnd);
        slider.addEventListener("touchcancel", dragEnd);

        // Handle resize
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                currentIndex = normalizeIndex(currentIndex);
                moveSlider(false);
            }, 200);
        });

        // Keyboard navigation
        document.addEventListener("keydown", function (e) {
            if (e.key === "ArrowLeft") {
                goTo(currentIndex - 1, true);
            } else if (e.key === "ArrowRight") {
                goTo(currentIndex + 1, true);
            }
        });

        // Initialize
        moveSlider(false);
    })();

    // -----------------------------------------------------------------
    // "Where to Stay" Prev/Next Slider Control Logic
    // -----------------------------------------------------------------
    const stayTrack = document.getElementById('stayCarouselTrack');
    const stayPrev = document.getElementById('stayPrevBtn');
    const stayNext = document.getElementById('stayNextBtn');

    if (stayTrack && stayPrev && stayNext) {
        const stayCards = Array.from(stayTrack.querySelectorAll('.stay-card-item'));
        let currentStayIndex = 0;

        function updateStaySlider() {
            if (stayCards.length === 0) return;
            const maxIndex = Math.max(0, stayCards.length - 3);
            if (currentStayIndex < 0) currentStayIndex = 0;
            if (currentStayIndex > maxIndex) currentStayIndex = maxIndex;

            const cardWidth = stayCards[0].offsetWidth + 24; // 24px gap
            stayTrack.style.transform = `translateX(-${currentStayIndex * cardWidth}px)`;
        }

        stayPrev.addEventListener('click', () => {
            if (currentStayIndex > 0) {
                currentStayIndex--;
                updateStaySlider();
            }
        });

        stayNext.addEventListener('click', () => {
            const maxIndex = Math.max(0, stayCards.length - 3);
            if (currentStayIndex < maxIndex) {
                currentStayIndex++;
                updateStaySlider();
            }
        });
    }

    // -----------------------------------------------------------------
    // "What To Do" Category Slider Prev/Next Control Logic
    // -----------------------------------------------------------------
    const todoTrack = document.getElementById('todoCarouselTrack');
    const todoPrev = document.getElementById('todoPrevBtn');
    const todoNext = document.getElementById('todoNextBtn');

    if (todoTrack && todoPrev && todoNext) {
        const todoCards = Array.from(todoTrack.querySelectorAll('.todo-card-item'));
        let currentTodoIndex = 0;

        function updateTodoSlider() {
            if (todoCards.length === 0) return;
            const maxIndex = Math.max(0, todoCards.length - 3);
            if (currentTodoIndex < 0) currentTodoIndex = 0;
            if (currentTodoIndex > maxIndex) currentTodoIndex = maxIndex;

            const cardWidth = todoCards[0].offsetWidth + 24; // 24px gap
            todoTrack.style.transform = `translateX(-${currentTodoIndex * cardWidth}px)`;
        }

        todoPrev.addEventListener('click', () => {
            if (currentTodoIndex > 0) {
                currentTodoIndex--;
                updateTodoSlider();
            }
        });

        todoNext.addEventListener('click', () => {
            const maxIndex = Math.max(0, todoCards.length - 3);
            if (currentTodoIndex < maxIndex) {
                currentTodoIndex++;
                updateTodoSlider();
            }
        });
    }
});