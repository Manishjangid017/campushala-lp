document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".btn-pill-tab");

    // 1. Initialize Swiper Slider 1 (Programs)
    const swiper = new Swiper(".programSwiper", {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
            nextEl: "#scrollRight",
            prevEl: "#scrollLeft",
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
        },
        observer: true,
        observeParents: true,
    });

    // 2. Initialize Swiper Slider 2 (Recognition)
    const swiper2 = new Swiper('.recognition-swiper', {
        slidesPerView: 2,
        spaceBetween: 16,
        loop: false,
        autoplay: false,
        breakpoints: {
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 4 }
        },
        navigation: {
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
        },
        pagination: {
            el: '.swiper-pagination-custom',
            clickable: true,
        },
        observer: true,
        observeParents: true,
    });

    // 3. Filter Functionality Logic
    function filterCards(targetCategory) {
        const slides = document.querySelectorAll(".programSwiper .swiper-slide");

        slides.forEach((slide) => {
            if (slide.classList.contains(`${targetCategory}-card`)) {
                slide.style.display = "block";
            } else {
                slide.style.display = "none";
            }
        });

        // Update & Reset Swiper 1
        swiper.update();
        swiper.slideTo(0);

        // Update Swiper 2 (Layout Refresh & Autoplay Restart)
        if (swiper2) {
            swiper2.update();
            if (swiper2.autoplay && swiper2.autoplay.running === false) {
                swiper2.autoplay.start(); // Autoplay interrupt na ho
            }
        }
    }

    // Initial tab filter setup
    filterCards("ug");

    // Tab Switching Click Event
    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            tabButtons.forEach((btn) => {
                btn.classList.remove("active", "bg-white", "text-eleventh", "shadow-sm");
                btn.classList.add("text-white", "text-opacity-90");
            });

            this.classList.add("active", "bg-white", "text-eleventh", "shadow-sm");
            this.classList.remove("text-white", "text-opacity-90");

            const targetGroup = this.getAttribute("data-target");
            filterCards(targetGroup);
        });
    });
});